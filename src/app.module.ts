import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/interfaces/auth.module';
import { TaskModule } from './modules/tasks/interfaces/task.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user/interfaces/user.module';
import { UtilService } from './common/services/util.service';
import { JwtModule } from '@nestjs/jwt';

@Module({ //esto esta dentro de un modulo
  imports: [AuthModule, TaskModule, UserModule,ConfigModule.forRoot({isGlobal: true}),
    JwtModule.registerAsync({
      global: true, // 👈 ESTO LO HACE GLOBAL EN TODA LA APP
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    })
  ],
  controllers: [], //controlador es la logica de negocio que se va a seguir
  providers: [UtilService], //son los que proveen el servicio a terceros o lugar externo
})
export class AppModule {}
