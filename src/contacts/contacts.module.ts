import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [UsersModule],
    controllers: [ContactsController],
    providers: [ContactsService],
})
export class ContactsModule { }
