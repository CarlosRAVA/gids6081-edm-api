import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "../dto/login.dto";

@Controller("api/auth")
export class AuthController {

    constructor(private authSvc: AuthService) {}

    // POST /auth/register - 201 Created

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    public login(@Body() loginDto: LoginDto): string { //es importante especificar que tipo de dato se esta retornando
        const { username, password } = loginDto;

        // TODO: Verificar el usuario y contraseña

        // TODO: Obtener la informacion del usuario (payload)

        // TODO: Generar el JWT 

        // TODO: devolver el JWT encriptado
        return this.authSvc.logIn();
    }

    

    @Get("/me")
    public getProfile() {

    }

    @Post("/refresh")
    public refreshToken(){

    }

    @Post("/logout")
    public logout() {

    }

}