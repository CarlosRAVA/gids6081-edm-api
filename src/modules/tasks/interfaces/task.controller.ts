import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "../dto/create-task.dto";


@Controller("api/task")
export class TaskController {

    constructor(private taskSvc: TaskService) {}

    //! http: localhost: 3000/api/task
    @Get()
    public getAllTask(): string { //es importante especificar que tipo de dato se esta retornando
        return this.taskSvc.getAllTask();
    }

    //! http: localhost: 3000/api/task/17
    //depende de cuantos parametros se envian para poder obtener la ruta del get que debe de ser diferente, ninguna puede ser igual
    @Get(":id") //lo adecuado es indicar que tipo de valor es
    public listTaskById(@Param("id") id: string){
        return this.taskSvc.getTaskById(parseInt(id));
    }

    @Post() //el insert se debe de enviar por medio del body, por si solo no se puede enviar datos
    public insertTask(@Body() task: CreateTaskDto): any{ //@Body es un decorator, siempre inician con un @
        console.error("insert", typeof task);
        return this.taskSvc.insertTask(task);
    }

    @Put(":id")
    public updateTask(id: number, task: any){
        return this.taskSvc.updateTask(task);
    }   

    @Delete(":id")
    public deleteTask(id: number){
        return this.taskSvc.deleteTask(id);
    }


}