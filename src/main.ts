import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //el "appmodule es el que contiene todas las rutas"
  //uso de pipes de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  })) //ya se tiene el validation pipe de forma global para todo el proyecto
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