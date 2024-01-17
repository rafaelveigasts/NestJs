import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDTO) {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.users.create({
      data: createUserDto,
    });

    return user;
  }

  async findAll() {
    return this.prisma.users.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'User not found',
        cause: 'teste',
      });
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDTO) {
    const user = await this.prisma.users.findFirst({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    await this.prisma.users.update({
      where: {
        id: id,
      },
      data: updateUserDto,
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
