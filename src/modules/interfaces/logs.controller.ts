import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { LogsService } from "./logs.service";
import { AuthGuard } from "src/common/guards/auth.guard";
import { Roles, RolesGuard } from "src/common/guards/roles.guard";

@Controller("api/logs")
@UseGuards(AuthGuard, RolesGuard)
export class LogsController {

    constructor(private readonly logsSvc: LogsService) {}

    @Get()
    @Roles("ADMIN")
    public async getLogs(
        @Query("session_id") session_id?: string,
        @Query("from") from?: string,
        @Query("to") to?: string,
        @Query("statusCode") statusCode?: string,
    ) {
        return await this.logsSvc.getLogs({
            session_id: session_id ? Number(session_id) : undefined,
            from,
            to,
            statusCode: statusCode ? Number(statusCode) : undefined,
        });
    }
}