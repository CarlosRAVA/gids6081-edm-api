import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TaskModule } from './modules/tasks/interfaces/task.module';

@Module({ //esto esta dentro de un modulo
  imports: [AuthModule, TaskModule],
  controllers: [], //controlador es la logica de negocio que se va a seguir
  providers: [], //son los que proveen el servicio a terceros o lugar externo
})
export class AppModule {}
