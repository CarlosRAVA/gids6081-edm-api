import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
    controllers: [AuthController], //puede tener mas de 1 controlador
    providers: [AuthService] //el proveedor es el servicio
})
export class AuthModule { }