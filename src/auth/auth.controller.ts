import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthloginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { AuthForgetDto } from './dto/auth.forget.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
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
  async resetPassword(@Body() password) {
    return this.authService.reset(password);
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
}
