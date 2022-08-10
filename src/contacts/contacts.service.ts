/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ContactsService { 
    constructor(private readonly usersService: UsersService) {}

    async addContact(userId: number, newContactId: number) {

        const user = await this.usersService.findOne(userId, {loadContacts: true});

        const newContact = await this.usersService.findOne(newContactId, {loadContacts: true});

        if (!user)
            throw new BadRequestException(`User with id ${userId} does not exist`);
        if (!newContact)
            throw new BadRequestException(`User with id ${newContactId} does not exist`);

        user.contacts.push(newContact);

        await this.usersService.updateUser(user.id, user);
        return true;
    }

    async getContacts(userId: number) {
        const user = await this.usersService.findOne(userId, {loadContacts: true});

        if (!user)
            throw new BadRequestException(`User with id ${userId} does not exist`);
        
        return user.contacts.map((user) => {
            const {passwordHash, ...userNoPwd} = user;
            return userNoPwd as User;
        });
    }
}
