import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/common/services/prisma.service";
import { UpdateUserDto } from "../dto/update-user.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { Task } from "@prisma/client";

@Injectable()
export class UserService {

    constructor(
        @Inject
            ('MYSQL_CONNECTION') private mysql: any,
        private prisma: PrismaService
    ) { }

    public async getAllUser(): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            orderBy: [{ name: "asc" }],
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                password: true, //deberia ser false
                hash: true,
                created_at: true
            }
        });

        return users;
    }

    public async getUserById(id: number): Promise<User | null> { //el id: number cumple para el elemento parametrizado mas abajo
        const user = await this.prisma.user.findUnique({
            where: { id }, //elemento parametrizado si el parametro se llama igual al que se setea aqui se puede dejar como {id} nadamas
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                password: true, //debe de ser false
                hash: true,
                created_at: true
            }
        });

        return user;
    }

    //corregir para consultar por nombre de usuario
    /* public async getUserByUsername(username: string): Promise<User> {
        const user = await this.prisma.user.findFirst({
            where: { username }
        });

        return user;
    } */

    public async updateUser(id: number, userUpdated: UpdateUserDto): Promise<User> {
        const user = await this.prisma.user.update({
            where: { id },
            data: userUpdated
        });

        return user;
    }

    public async insertUser(user: CreateUserDto): Promise<User> {
        const newUser = await this.prisma.user.create({
            data: user
        });

        return newUser;
    }

    public async deleteUser(id: number): Promise<User> {
        const user = await this.prisma.user.delete({
            where: { id },
            include: { task: true }
        });

        if (user?.task && user.task.length > 0) {
            throw new BadRequestException(
                'No se puede eliminar el usuario porque tiene tareas asignadas',
            );
        }

        return await this.prisma.user.delete({ where: { id } });

    }

}