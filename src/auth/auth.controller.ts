/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('/api/auth')
export class AuthController {
    constructor(private readonly usersService: UsersService) {}

    @Post('/sign-up')
    async signUp(@Body() user: CreateUserDto): Promise<void> {
        this.usersService.createUser(user);
    }
}
