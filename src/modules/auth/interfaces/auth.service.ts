import { Injectable } from "@nestjs/common";

@Injectable() //los servicios se inyectan en un constructor
export class AuthService { 

    public logIn(): string {
        return "Sesión Correcta";
    }
}