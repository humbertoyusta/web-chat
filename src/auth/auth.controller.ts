/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, HttpException, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,    
    ) {}

    @Post('sign-up')
    async signUp(@Body() user: SignUpUserDto): Promise<User> {
        return await this.usersService.createUser(user);
    }

    @Get('sign-in')
    async signIn(@Body() user: SignInUserDto) {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (!userInDb) {
            throw new UnauthorizedException('Incorrect username or password');
        }
        else {
            if (user.password === userInDb.password) {
                return {
                    access_token: this.jwtService.sign({user: user.username, password: user.password}),
                };
            }
            else {
                throw new UnauthorizedException('Incorrect username or password');
            }
        }
    }
}
