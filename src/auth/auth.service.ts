import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import *as bcryptjs from 'bcryptjs';

import { CreateUserDto, UpdateAuthDto, LogintDTO, RegisterUserDTO } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interface/jwt-payload';
import { LoginResponse } from './interface/login-response';


@Injectable()
export class AuthService {
  

  constructor(
    private jwtService: JwtService,
    @InjectModel( User.name ) private userModel: Model<User>
  ){}


  async create(createUserDto: CreateUserDto): Promise<User> {
    try{

      const { password, ...userData} = createUserDto

      const newUser = new this.userModel( {
        password: bcryptjs.hashSync( password, 10),
        ...userData
      } )      

      await newUser.save()
      const { password:_, ...user } = newUser.toJSON();

      return user


    } catch (error) {
      if (error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } ya exixte!`)//ya exixte 
      }
      throw new InternalServerErrorException('Something terrible happen!!!');//¡¡¡Algo terrible pasó!!!
    }
  }

  async register( registerDTO: RegisterUserDTO ): Promise<LoginResponse>{

    const user = await this.create( registerDTO )
    console.log({ user })

    return {
      user: user,
      token: this.getJwtToken({ id: user._id! })
    }
  }


  async login( loginDTO: LogintDTO): Promise<LoginResponse>{
    
    const { email, password } = loginDTO;

    const user = await this.userModel.findOne( {email} )
    if ( !user ) {
      throw new UnauthorizedException('Credenciales no válidas - correo electrónico')
    }

    // Asegúrate de que user.password no sea undefined
    if (!user.password) {
      throw new UnauthorizedException('Credenciales no válidas - contraseña no definida');
    }

    // Compara la contraseña
    if (!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no válidas - contraseña incorrecta');
    }

    //Excluye la contraseña del objeto de usuario que devuelves
    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({ id: user.id })
    }
  }


  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById( id: string ){
    const user = await this.userModel.findById( id );
    const { password, ...rest } = user!.toJSON()
    return rest
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload)
    return token
  }
}
