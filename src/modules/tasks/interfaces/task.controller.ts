import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "../dto/create-task.dto";
import { Task } from "../entities/task.entity";
import { updateTaskDto } from "../dto/update-task.dto";


@Controller("api/task")
export class TaskController {

    constructor(private taskSvc: TaskService) {}

    //! http: localhost: 3000/api/task
    @Get()
    async getAllTask(): Promise<Task[]> { //es importante especificar que tipo de dato se esta retornando
        return await this.taskSvc.getAllTask();
    }

    //! http: localhost: 3000/api/task/17
    //depende de cuantos parametros se envian para poder obtener la ruta del get que debe de ser diferente, ninguna puede ser igual
    @Get(":id") //lo adecuado es indicar que tipo de valor es
    public async listTaskById(@Param("id", ParseIntPipe) id: number): Promise<Task>{
        const result = await this.taskSvc.getTaskById(id);
        console.log("Tipo de dato: ", typeof result);

        if (result == undefined)
            throw new HttpException(`Tarea con ID no encontrado`, HttpStatus.NOT_FOUND); //mensaje de error por HTTP, con mensaje personalizado

        return result;
    }

    @Post() //el insert se debe de enviar por medio del body, por si solo no se puede enviar datos
    public async insertTask(@Body() task: CreateTaskDto): Promise<Task>{ //@Body es un decorator, siempre inician con un @
        const result = this.taskSvc.insertTask(task);

        if (result == undefined)
            throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR);

        return result;
    }

    @Put(":id")
    public async updateTask(@Param("id", ParseIntPipe) id: number, @Body() task: updateTaskDto): Promise<Task>{
        return await this.taskSvc.updateTask(id, task);
    }   

    @Delete(":id")
    public async deleteTask(@Param("id", ParseIntPipe) id: number): Promise<boolean>{
        /* const result = await this.taskSvc.deleteTask(id);

        if (!result)
            throw new HttpException("No se puede eliminar la tarea", HttpStatus.NOT_FOUND);
        
        return result; */
        try {
            await this.taskSvc.deleteTask(id);
        } catch (error) {
            throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
        }
        return true;
    }


}