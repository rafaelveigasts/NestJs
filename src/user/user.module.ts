import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserIdCheckMiddleware } from 'src/middleware/user-id-check.middleware';
import { RoleGuard } from 'src/guards/role.guard';
import { Reflector } from '@nestjs/core';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity]),
  ], // forwardRef() é usado para resolver o problema de dependência circular, dependência circular é quando um módulo depende de outro módulo que depende do primeiro módulo, para resolver isso, é necessário usar o forwardRef() para que o módulo que depende do outro seja carregado depois, deve ser usado nos dois módulos que dependem um do outro. Nesse caso o módulo AuthModule depende do módulo UserModule e o módulo UserModule depende do módulo AuthModule
  controllers: [UserController],
  providers: [UserService, RoleGuard, Reflector],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdCheckMiddleware).forRoutes({
      path: 'users/:id',
      method: RequestMethod.GET,
    });
  }
}
