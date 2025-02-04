import { IsEmail, IsString, MinLength } from "class-validator";


export class CreateUserDto {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}

//por lado del administrador