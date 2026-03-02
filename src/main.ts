import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //el "appmodule es el que contiene todas las rutas"
  //uso de pipes de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  })) //ya se tiene el validation pipe de forma global para todo el proyecto

  //Configuracion de swagger 
  const config = new DocumentBuilder()
    .setTitle('API con vulnerabilidades de seguridad')
    .setDescription('Documentacion de la API para pruebas')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();


//! git commit -a -m "fix: Correcion de estructura de objetos"

//? MYSQL
//! npm i mysql2
//! npm i @types/mysql -D

//? POSTGRES
//! npm i pg
//! npm i @types/pg

//! git commit -a -m "fix: Conexion a base de datos (MYSQL/POSTGRES) con uso de providers"

//? SWAGGER
//! npm i @nestjs/swagger