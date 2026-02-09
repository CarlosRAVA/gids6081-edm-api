import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";


@Module({
    controllers: [TaskController], //puede tener mas de 1 controlador
    providers: [TaskService] //el proveedor es el servicio
})
export class TaskModule { }