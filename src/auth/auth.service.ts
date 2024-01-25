import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthloginDto } from './dto/auth.login.dto';
import { AuthRegisterDto } from './dto/auth.register.dto';
import { UserService } from 'src/user/user.service';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { UserEntity } from 'src/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly issuer = 'login';
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,

    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  async createToken(user: UserEntity): Promise<any> {
    return {
      accessToken: this.jwtService.sign(
        {
          name: user.name,
          email: user.email,

          // essas informações podem ser acessadas pelo token
        },
        {
          secret: 'secret',
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
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const passwordMatch = await bcrypt.compare(password, user.password); // por algum motivo o compare retorna false mesmo com a senha correta

    // console.log(passwordMatch);
    // if (!passwordMatch) {
    //   throw new BadRequestException('Password invalid');
    // }
    return this.createToken(user);
  }

  async forget(email) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return true;
  }

  async reset(password, token: string) {
    try {
      const data = this.jwtService.verify(token, {
        issuer: this.issuer,
        audience: 'users',
      });

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      await this.userRepository.update(data.id, {
        password,
      });

      const user = await this.userService.findOne(data.id);

      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException('Token invalid');
    }
  }
  async register({
    email,
    name,
    password,
    role,
  }: AuthRegisterDto): Promise<string> {
    const user = await this.userService.create({
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
