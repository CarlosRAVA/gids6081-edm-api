import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaService } from "src/common/services/prisma.service";
import { UtilService } from "src/common/services/util.service";

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService], // 👈 útil si lo usas en otros módulos
})
export class AuthModule {}

//! agregar el secret de jwt (configuracion del mismo)