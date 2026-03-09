import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TaskModule } from './modules/tasks/interfaces/task.module';
import { UserModule } from './modules/user/interfaces/user.module';
import { UtilService } from './common/services/util.service';

@Module({ //esto esta dentro de un modulo
  imports: [AuthModule, TaskModule, UserModule],
  controllers: [], //controlador es la logica de negocio que se va a seguir
  providers: [UtilService], //son los que proveen el servicio a terceros o lugar externo
})
export class AppModule {}
