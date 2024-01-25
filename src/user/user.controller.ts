import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';
import { LogInterceptor } from 'src/interceptors/interceptors.module';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
@Roles(Role.Admin)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: CreateUserDTO): Promise<any> {
    return this.userService.create(body);
  }

  @Roles(Role.User, Role.Admin)
  @Get()
  async findAll(): Promise<any> {
    const users = await this.userService.findAll();

    return users;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id): Promise<any> {
    const user = await this.userService.findOne(id);

    return user;
  }

  @Put(':id')
  async update(@ParamId() id, @Body() body: UpdateUserDTO): Promise<any> {
    return {
      user: {},
      params: id,
      body,
    };
  }

  @Patch(':id')
  async updatePartial(@Param() id, @Body() body): Promise<any> {
    return {
      user: {},
      params: id,
      body,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id): Promise<any> {
    return {
      user: {},
      params: id,
    };
  }
}
