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

    @Post('contacts/:id1/:id2')
    async addContact(
        @Param('id1') userId: number, 
        @Param('id2') newContactId: number,
    ) {
        const user = await this.usersService.findOne(userId, {loadContacts: true});

        const newContact = await this.usersService.findOne(newContactId, {loadContacts: true});

        if (!user)
            throw new BadRequestException(`User with id ${userId} does not exist`);
        if (!newContact)
            throw new BadRequestException(`User with id ${newContactId} does not exist`);

        await this.usersService.addContact(user, newContact);
    }
}
