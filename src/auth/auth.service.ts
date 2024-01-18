import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthloginDto } from './dto/auth.login.dto';
import { Users } from '@prisma/client';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { UserService } from 'src/user/user.service';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: Users): Promise<any> {
    return {
      accessToken: this.jwtService.sign(
        {
          name: user.name,
          email: user.email,
          // essas informações podem ser acessadas pelo token
        },
        {
          expiresIn: '7d',
          subject: '1',
          issuer: this.issuer,
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      const data = this.jwtService.verify(token, {
        // audience: 'users',
        issuer: this.issuer,
      });

      return data;
    } catch (error) {
      throw new BadRequestException('Token invalid');
    }
  }

  async login({ email, password }: AuthloginDto) {
    const user = await this.prisma.users.findFirst({
      where: { email, password },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const passwordMatch = await bcrypt.compare(password, user.password); // por algum motivo o compare retorna false mesmo com a senha correta

    if (password !== user.password) {
      throw new BadRequestException('Password invalid');
    }

    return this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.users.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async reset(password) {
    const id = 1;
    const user = await this.prisma.users.update({
      where: { id },
      data: { password },
    });

    return this.createToken(user);
  }

  async register({
    email,
    name,
    password,
    role,
  }: AuthRegisterDto): Promise<string> {
    const user: Users = await this.userService.create({
      email,
      name,
      password,
      role,
    });

    return this.createToken(user);
  }

  isValidToken(token: string): boolean {
    try {
      this.jwtService.verify(token, {
        issuer: this.issuer,
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
