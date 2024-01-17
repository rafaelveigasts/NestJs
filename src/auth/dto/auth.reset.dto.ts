import { IsJWT, IsString } from 'class-validator';

export class AuthResetDto {
  @IsString()
  password: string;

  @IsJWT()
  token: string;
}
