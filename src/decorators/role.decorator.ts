import { SetMetadata } from '@nestjs/common';
import { Role } from 'src/enums/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

// Esse arquivo é um decorator que vai ser usado para definir as roles de cada rota. O spread operator (...) vai pegar todos os parâmetros passados e colocar dentro de um array. O decorator SetMetadata vai definir a chave 'roles' e o valor vai ser o array de roles passado como parâmetro.
