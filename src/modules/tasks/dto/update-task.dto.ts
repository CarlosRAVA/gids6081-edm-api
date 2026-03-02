import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class updateTaskDto {

    @IsOptional()
    @IsString({message: 'Debe ser una cadena', })
    @MinLength(3, {message: 'Debe tener al menos 3 caracteres'}) //el message se agrega solo pero en ingles, se puede personalizar para que sea en español
    name?: string; //con el signo de interrogacion indica que puede regresar el name o un indefinido

    @IsOptional()
    @IsString({message: 'Debe ser una cadena', })
    @MinLength(3, {message: 'Debe tener al menos 3 caracteres'})
    description?: string;

    @IsOptional()
    @IsBoolean()
    priority?: boolean;
}