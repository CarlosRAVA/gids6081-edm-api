import { Inject, Injectable } from "@nestjs/common";
import { Task } from "../entities/task.entity";
//npm run start:dev
@Injectable() //los servicios se inyectan en un constructor
export class TaskService { 

    constructor(
        @Inject('MYSQL_CONNECTION') private mysql: any,
    ) {}

    public async getAllTask(): Promise<Task[]> {
        const query = `SELECT * FROM tasks ORDER BY name ASC`;

        const [results] = await this.mysql.query(query);
        console.log(results);

        return results as Task[] //con esto se indica que es arreglo de tareas;
    }
    public getTaskById(id: number): string {
        return `Obteniendo la tarea ${id}`;
    }
    public updateTask(task: any): any {
        return task;
    }
    public insertTask(task: any): any {
        return task;
    }
    public deleteTask(id: number): any {
        return `Eliminando la tarea ${id}`;
    }
}

