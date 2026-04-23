import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/services/prisma.service";

@Injectable()
export class LogsService {

    constructor(private readonly prisma: PrismaService) {}

    // Obtener todos los logs con filtros opcionales
    public async getLogs(filters: {
        session_id?: number;
        from?: string;
        to?: string;
        statusCode?: number;
    }) {
        const where: any = {};

        // Filtro por usuario (session_id)
        if (filters.session_id) {
            where.session_id = Number(filters.session_id);
        }

        // Filtro por rango de fechas
        if (filters.from || filters.to) {
            where.timestamp = {};
            if (filters.from) where.timestamp.gte = new Date(filters.from);
            if (filters.to)   where.timestamp.lte = new Date(filters.to);
        }

        // Filtro por código de status (severidad)
        if (filters.statusCode) {
            where.statusCode = Number(filters.statusCode);
        }

        return await this.prisma.logs.findMany({
            where,
            orderBy: { timestamp: "desc" },
            take: 200, // límite de seguridad
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        lastname: true,
                        // nunca exponer password ni hash
                    }
                }
            }
        });
    }
}