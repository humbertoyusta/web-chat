/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Message } from './entities/message.entity';

const MESSAGES_LIMIT = 20;

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messagesRepository: Repository<Message>,
    ) { }

    async send(senderId: number, receiverId: number, text: string) {
        const sender = { id: senderId };
        const receiver = { id: receiverId };
        return await this.messagesRepository.save({ text, sender, receiver });
    }

    async findAll(id: number, paginationQueryDto: PaginationQueryDto, options?: { onlySent?: boolean, onlyReceived?: boolean }): Promise<Message[]> {
        if (options && options.onlySent && options.onlyReceived)
            return [];

        let whereOptions, relationOptions: string[];
        if (options && options.onlySent)
        {
            whereOptions = {sender: {id}};
            relationOptions = ["receiver"];
        }
        else if (options && options.onlyReceived)
        {
            whereOptions = {receiver: {id}};
            relationOptions = ["sender"];
        }
        else 
        {
            whereOptions = [{ sender: { id } }, { receiver: { id } }];
            relationOptions = ["sender", "receiver"];
        }

        const messagesList = await this.messagesRepository.find({ 
            where: whereOptions, 
            order: {sentAt: -1},
            relations: relationOptions,
            take: paginationQueryDto.limit || MESSAGES_LIMIT,
            skip: paginationQueryDto.offset || 0,
        });

        for (const message of messagesList) {
            if (message.receiver) {
                const { passwordHash, ...receiverNoPass } = message.receiver;
                message.receiver = receiverNoPass as User;
            }
            if (message.sender) {
                const { passwordHash, ...senderNoPass } = message.sender;
                message.sender = senderNoPass as User;
            }
        }
    
        return messagesList;
    }
}
