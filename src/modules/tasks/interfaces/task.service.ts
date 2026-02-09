import { Injectable } from "@nestjs/common";

@Injectable() //los servicios se inyectan en un constructor
export class TaskService { 

    public getAllTask(): string {
        return "Lista de tareas";
    }
    public getTaskById(id: number): string {
        return "Obteniendo la tarea ${id}";
    }
    public updateTask(task: any): any {
        return task;
    }
    public insertTask(task: any): any {
        return task;
    }
    public deleteTask(id: number): any {
        return 'Eliminando la tarea ${id}';
    }
}