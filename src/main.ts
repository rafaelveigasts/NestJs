import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/interceptors.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });
  app.useGlobalPipes(new ValidationPipe()); // adiciona o módulo de validação de dados
  app.useGlobalInterceptors(new LogInterceptor()); // adiciona o módulo de interceptors assim todos os métodos dos controllers terão o interceptor
  await app.listen(3000);
}
bootstrap();

// o bootstrap() é uma função assíncrona que cria uma instância do NestFactory. NestFactory é uma classe que expõe um método estático create() que retorna uma Promise. O método create() aceita um argumento, que é uma classe que representa o módulo raiz da aplicação. Neste caso, o AppModule é o módulo raiz da aplicação. O método listen() é assíncrono e aceita um argumento, que é a porta em que a aplicação vai rodar. Neste caso, a aplicação vai rodar na porta 3000.
