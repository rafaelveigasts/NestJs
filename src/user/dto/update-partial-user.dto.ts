import { CreateUserDTO } from './create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePartialUserDTO extends PartialType(CreateUserDTO) {}
