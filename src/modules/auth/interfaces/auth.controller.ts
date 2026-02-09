import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("")
export class AuthController {

    constructor(private authSvc: AuthService) {}

    @Get([])
    public login(): string { //es importante especificar que tipo de dato se esta retornando
        return this.authSvc.logIn();
    }
}