/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserNoPassDto } from 'src/users/dto/user.no-pass.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,  
    ) {}

    @Post('sign-up')
    async signUp(@Body() user: SignUpUserDto): Promise<UserNoPassDto> {
        return await this.authService.signUp(user);
    }

    @Post('sign-in')
    async signIn(@Body() user: SignInUserDto) {
        return await this.authService.signIn(user);
    }

    @Delete()
    async deleteUser(@Body() user: SignInUserDto): Promise<UserNoPassDto> {
        return await this.authService.deleteUser(user);
    }
}
