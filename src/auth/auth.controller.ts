import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LogintDTO } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO } from './dto/register-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { get } from 'mongoose';
import { User } from './entities/user.entity';
import { LoginResponse } from './interface/login-response';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login( @Body() loginDTO: LogintDTO ){
    return this.authService.login( loginDTO )
  } 


  @Post('/register')
  register( @Body() registerDTO: RegisterUserDTO ){
    return this.authService.register( registerDTO )
  } 

  @UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request ) {
    // const user = req['user']
    // return user
    return this.authService.findAll();
  }

  @UseGuards( AuthGuard )
  @Get('check-token')
  checkToken( @Request() req: Request ): LoginResponse{

    const user = req['user'] as User

    return{
      user,
      token: this.authService.getJwtToken({ id: user._id! })
    }
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }

  
}
