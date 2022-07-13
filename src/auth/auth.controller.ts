/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { UserNoPassDto } from '../users/dto/user.no-pass.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenUserDto } from './dto/jwt-token-user.dto';
import { OnlyPasswordDto } from './dto/only-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,  
        private readonly jwtService: JwtService,
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
    async deleteUser(@Req() request: Request, @Body() {password}: OnlyPasswordDto): Promise<UserNoPassDto> {
        const user: JwtTokenUserDto = 
            await this.jwtService.verify(request.headers.authorization);
        return await this.authService.deleteUser(user, password);
    }

    @Patch()
    async updateUser(@Req() request: Request, @Body() updUser: UpdateUserDto) {
        const authUser: JwtTokenUserDto = 
            await this.jwtService.verify(request.headers.authorization);
        return await this.authService.updateUser(authUser.id, updUser);
    }
}
