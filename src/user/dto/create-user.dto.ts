import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Role } from 'src/enums/role.enum';

export class CreateUserDTO {
  @IsString()
  readonly name: string;
  @IsEmail()
  readonly email: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: 0,
    minSymbols: 0,
  })
  readonly password: string;

  @IsOptional()
  @IsEnum(Role)
  role: string;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {}
