/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('sign-up')
    async signUp(@Body() user: SignUpUserDto): Promise<void> {
        await this.usersService.createUser(user);
    }

    @Get('sign-in')
    async signIn(@Body() user: SignInUserDto): Promise<void> {

    }
}
