import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";
import { User } from "src/modules/user/entities/user.entity";

@Injectable() //los servicios se inyectan en un constructor
export class AuthService { 

    constructor(private readonly prisma: PrismaService) { }

    public async getUserByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({
            where: { username }
        });
    }

}