import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionfilter } from './common/filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule); //el "appmodule es el que contiene todas las rutas"

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
  });

  //uso de pipes de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  })) //ya se tiene el validation pipe de forma global para todo el proyecto

  //Uso de filtros globales 
  app.useGlobalFilters(new AllExceptionfilter());

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

//! git commit -a -m "fix: CRUD funcional con Bases de datos y configuracion de SWAGGER"

//!--datasource-provider mysql

//! git commit -m -a "Fix: uso de prisma y correcion del crud (task)"

//? BCRYPT
//! npm i bcrypt
//! npm i -D @types/bcrypt

//! git commit -m "fix: CRUD de usuarios y creacion de rutas para la autenticacion"

//! git commit -m "fix: Inicio de sesion compleeto y proteccion de rutas"

//! git commit -m "bug: correccion de inicio de sesion y configuracion de rutas (me/logout, refresh)"

//! git commit -m "fix: Uso de custom errors y creacion de logs"|