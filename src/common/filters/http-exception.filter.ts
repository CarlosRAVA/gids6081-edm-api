import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import { Request, Response } from "express";
import { PrismaService } from "../services/prisma.service";

@Injectable()
export class AllExceptionfilter implements ExceptionFilter {

  constructor(private readonly prisma: PrismaService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx     = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = exception instanceof HttpException
      ? exception.getResponse()
      : "Internal Server Error";

    const errorText =
      typeof message === "string"
        ? message
        : (message as any).message || JSON.stringify(message);

    const errorCode = (exception as any).errorCode || (exception as any).code || "UNKNOWN_ERROR";

    // Obtener el user id del request si hay sesión activa
    const sessionUser = (request as any)["user"];
    const session_id: number | null = sessionUser?.id ?? null;

    // Guardar en la base de datos — nunca lanzar error desde aquí
    try {
      await this.prisma.logs.create({
        data: {
          statusCode: status,
          timestamp:  new Date(),
          path:       request.url,
          error:      errorText,
          errorCode:  errorCode,
          session_id: session_id,
        },
      });
    } catch {
      // Si falla el log no interrumpimos la respuesta
    }

    // Responder al cliente sin exponer stack traces
    response.status(status).json({
      statusCode: status,
      timestamp:  new Date().toISOString(),
      path:       request.url,
      error:      errorText,
      errorCode:  errorCode,
    });
  }
}