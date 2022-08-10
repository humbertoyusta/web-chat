/*
https://docs.nestjs.com/controllers#controllers
*/

import { BadRequestException, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { UserNoPassDto } from './dto/user.no-pass.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<UserNoPassDto[]> {
        // Get all users
        const allUsers = await this.usersService.findAll();
        // Removing passwords
        const listUsers = allUsers.map((user) => {
            const {passwordHash, ...userNoPass} = user;
            return userNoPass as UserNoPassDto;
        })
        return listUsers;
    }
}
