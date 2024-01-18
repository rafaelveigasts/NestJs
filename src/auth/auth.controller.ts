import {
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthloginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { AuthForgetDto } from './dto/auth.forget.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService,
  ) {}
  @Post('login')
  async login(@Body() { email, password }: AuthloginDto) {
    return this.authService.login({ email, password });
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDto) {
    return this.authService.register(body);
  }

  @Post('forget-password')
  async forgetPassword(@Body() { email }: AuthForgetDto) {
    return this.authService.forget(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() password: string, @Body() token: string) {
    return this.authService.reset(password, token);
  }

  // assim retorna somente o email do usuário quando passar pelo guard ou a propriedade que for passada
  // @UseGuards(AuthGuard)
  // @Post('me')
  // async me(@User('email') user) {
  //   return {
  //     user,
  //   };
  // }

  // assim retorna o usuário completo quando passar pelo guard
  @UseGuards(AuthGuard)
  @Post('me')
  async me(@User() user) {
    return {
      user,
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'image/png',
          }),
          new MaxFileSizeValidator({
            maxSize: 2000000, // 2MB,
          }),
        ],
      }),
    )
    file,
  ) {
    const path = join(__dirname, '../', '../', 'storage', 'user_photos');

    await writeFile(path + `/${user.id}.png`, file.buffer);

    this.fileService.uploadFile(path + `/${user.id}.png`, file);

    return {
      path: path + `/${user.id}.png`,
    };
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(@User() user, @UploadedFiles() files) {
    return {
      user,
      files,
    };
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photos',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 2,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(
    @User() user,
    @UploadedFiles() files: { photos: any; documents: any },
  ) {
    return files;
  }
}
