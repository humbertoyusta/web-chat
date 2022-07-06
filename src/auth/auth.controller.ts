/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
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
    async signUp(@Body() user: SignUpUserDto): Promise<User> {
        return await this.authService.signUp(user);
    }

    @Get('sign-in')
    async signIn(@Body() user: SignInUserDto) {
        return await this.authService.signIn(user);
    }
}
