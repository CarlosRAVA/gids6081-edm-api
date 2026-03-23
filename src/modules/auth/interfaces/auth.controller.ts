import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../dto/login.dto";
import { UtilService } from "src/common/services/util.service";

@Controller("api/auth")
export class AuthController {

    constructor(private readonly authSvc: AuthService,
        private readonly utilSvc: UtilService
    ) { }

    // POST /auth/register - 201 Created

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() loginDto: LoginDto): Promise<any> { //es importante especificar que tipo de dato se esta retornando
        const { username, password } = loginDto;

        // Verificar el usuario y contraseña
        const user = await this.authSvc.getUserByUsername(username);
        if (!user)
            throw new UnauthorizedException('El usuario y/o contraseña es incorrecto');


        if (await this.utilSvc.checkPassword(password, user.password!)) {
            // Obtener la informacion del usuario (payload)
            const { password, username, ...payload } = user; //segmentacion dee que recibira el payload

            // Generar el JWT
            const access_token = await this.utilSvc.generateJWT(payload);

            // Geenerar el refresh token
            const refresh_token = await this.utilSvc.generateJWT(payload, '7d');

            // devolver el JWT encriptado
            return {
                access_token,
                refresh_token
            }

        } else {
            throw new UnauthorizedException('El usuario y/o contraseña son incorrectos');
        }
    }



    @Get("/me")
    public getProfile() {

    }

    @Post("/refresh")
    public refreshToken() {

    }

    @Post("/logout")
    public logout() {

    }

}