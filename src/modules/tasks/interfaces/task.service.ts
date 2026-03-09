import { Inject, Injectable } from "@nestjs/common";
import { Task } from "../entities/task.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { updateTaskDto } from "../dto/update-task.dto";
import { PrismaService } from "src/common/services/prisma.service";
//npm run start:dev
@Injectable() //los servicios se inyectan en un constructor
export class TaskService { 

    constructor(
        @Inject('MYSQL_CONNECTION') private mysql: any,
        private prisma: PrismaService
    ) {}

    //obtener las tareas
    public async getAllTask(): Promise<Task[]> {
        const tasks = await this.prisma.task.findMany({
            orderBy: [ { name: "asc" } ]
        });

        return tasks;
    }


    //obtener las tareas por id
    public async getTaskById(id: number): Promise<Task | null> { //el id: number cumple para el elemento parametrizado mas abajo
        const task = await this.prisma.task.findUnique({
            where: { id } //elemento parametrizado si el parametro se llama igual al que se setea aqui se puede dejar como {id} nadamas
        });

        return task;
    }


    //actualizar tarea
    public async updateTask(id: number, taskUpdated: updateTaskDto): Promise<Task> {
        const task = await this.prisma.task.update({
            where: { id },
            data: taskUpdated
        });

        return task;
    }

    //insertar
    public async insertTask(task: CreateTaskDto): Promise<Task> {
        const newTask = await this.prisma.task.create({
            data: task
        });

        return newTask;
    }


    //eliminar una tarea
    public async deleteTask(id: number): Promise<Task> {
        const task = await this.prisma.task.delete({
            where: {id}
        });

        return task;
    }
}

