import { Inject, Injectable } from "@nestjs/common";
import { Task } from "../entities/task.entity";
import { CreateTaskDto } from "../dto/create-task.dto";
import { updateTaskDto } from "../dto/update-task.dto";
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


    public async getTaskById(id: number): Promise<Task> { 
        const query = `SELECT * FROM tasks WHERE id = ${ id }`;

        const [result] = await this.mysql.query(query);

        return result[0] as Task;
    }


    public async updateTask(id: number, taskUpdated: updateTaskDto): Promise<Task> {
        const task = await this.getTaskById(id);
        task.name = taskUpdated.name ?? task.name;
        
        task.description = taskUpdated.description ?? task.description;
        
        task.priority = taskUpdated.priority ?? task.priority;
        
        const query = `UPDATE tasks SET name = '${task.name}', description = '${task.description}', priority = ${task.priority} WHERE id = ${id}`;

        await this.mysql.query(query);

        return await this.getTaskById(id);
    }

    //insertar
    public async insertTask(task: CreateTaskDto): Promise<Task> {
        const sql = `INSERT INTO tasks (name, description, priority, user_id) VALUES ('${ task.name }', '${task.description}', ${task.priority} ,${task.user_id} )`;

        const [results] = await this.mysql.query(sql);
        const insertId = results.insertId;
        return await this.getTaskById(insertId);
    }


    public async deleteTask(id: number): Promise<boolean> {
        const query = `DELETE FROM tasks WHERE id = ${id}`;
        const [result] = await this.mysql.query(query);

        return result.affectedRows > 0;
    }
}

