/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        // Get all users
        const allUsers = await this.usersService.findAll();
        // Removing passwords
        for (let user of allUsers)
            delete user.password;
        return allUsers;
    }
}
