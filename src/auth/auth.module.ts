import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '5h' },
    }),
    forwardRef(() => UserModule), // forwardRef() é usado para resolver o problema de dependência circular, dependência circular é quando um módulo depende de outro módulo que depende do primeiro módulo, para resolver isso, é necessário usar o forwardRef() para que o módulo que depende do outro seja carregado depois
    PrismaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
