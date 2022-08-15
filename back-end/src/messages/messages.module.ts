import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Message } from './entities/message.entity';

@Module({
    imports: [UsersModule, TypeOrmModule.forFeature([Message])],
    controllers: [MessagesController],
    providers: [MessagesService],
})
export class MessagesModule { }
