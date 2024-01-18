import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/interceptors.module';
import { EnvService } from './infra/config/env/env.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  const config = new DocumentBuilder()
    .setTitle('Curso Nest')
    .setDescription('API de exemplo do curso de Nest')
    .setVersion('1.0')
    .addTag('NEST')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // para acessar a documentação da API, acesse http://localhost:3000/api
  app.enableCors(); // habilita o cors, verificar a doc para mais detalhes https://docs.nestjs.com/security/cors
  app.useGlobalPipes(new ValidationPipe()); // adiciona o módulo de validação de dados
  app.useGlobalInterceptors(new LogInterceptor()); // adiciona o módulo de interceptors assim todos os métodos dos controllers terão o interceptor
  const configService = app.get(EnvService); // obtém o serviço de configuração
  const port = configService.get('PORT'); // obtém a porta da aplicação
  await app.listen(port);
}
bootstrap();

// o bootstrap() é uma função assíncrona que cria uma instância do NestFactory. NestFactory é uma classe que expõe um método estático create() que retorna uma Promise. O método create() aceita um argumento, que é uma classe que representa o módulo raiz da aplicação. Neste caso, o AppModule é o módulo raiz da aplicação. O método listen() é assíncrono e aceita um argumento, que é a porta em que a aplicação vai rodar. Neste caso, a aplicação vai rodar na porta 3000.
