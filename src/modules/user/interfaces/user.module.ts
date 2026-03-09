import { Module } from "@nestjs/common";
import { mysqlProvider } from "src/common/providers/mysql.provider";
import { PrismaService } from "src/common/services/prisma.service";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UtilService } from "src/common/services/util.service";

@Module({
    controllers: [UserController],
    providers: [UserService, PrismaService, mysqlProvider, UtilService]
})


export class UserModule{ }