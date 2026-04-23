import { Module } from "@nestjs/common";
import { LogsController } from "./logs.controller";
import { LogsService } from "./logs.service";
import { PrismaService } from "src/common/services/prisma.service";
import { UtilService } from "src/common/services/util.service";
import { Reflector } from "@nestjs/core";

@Module({
  controllers: [LogsController],
  providers: [LogsService, PrismaService, UtilService, Reflector],
})
export class LogsModule {}