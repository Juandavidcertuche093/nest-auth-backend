import { IsEmail, IsString, MinLength } from "class-validator";


export class RegisterUserDTO {

    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @MinLength(6)
    password: string;

}

//por el lado del usurio