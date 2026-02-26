import { Module } from "@nestjs/common";
import { TaskService } from "./task.service";
import { TaskController } from "./task.controller";
import { mysqlProvider } from "src/common/providers/mysql.provider";


@Module({
    controllers: [TaskController], //puede tener mas de 1 controlador
    providers: [TaskService, mysqlProvider] //el proveedor es el servicio
})
export class TaskModule { }