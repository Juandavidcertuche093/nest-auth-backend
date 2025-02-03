import { IsEmail, MinLength } from "class-validator";


export class LogintDTO {

    @IsEmail()
    email: string

    @MinLength(6)
    password: string
    
}