/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param, Post } from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('api/contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) {}

    @Post(':id1/:id2')
    async addContact(
        @Param('id1') userId: number, 
        @Param('id2') newContactId: number,
    ) {
        await this.contactsService.addContact(userId, newContactId);
    }

    @Get(':id')
    async getContacts(@Param('id') userId: number) {
        return await this.contactsService.getContacts(userId);
    }
}
