/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messagesRepository: Repository<Message>,
    ) {}

    async send(senderId: number, receiverId: number, text: string) {
        const sender = {id: senderId};
        const receiver = {id: receiverId};
        return await this.messagesRepository.save({text, sender, receiver});
    }

    async findAll(id: number, options?: {onlySent?: boolean, onlyReceived?: boolean}): Promise<Message[]> {
        if (options && options.onlySent && options.onlyReceived)
            return [];
        else if (options && options.onlySent)
            return await this.messagesRepository.find({where: {sender: {id}}, relations: ["receiver"]});
        else if (options && options.onlyReceived)
            return await this.messagesRepository.find({where: {receiver: {id}}});
        else
            return await this.messagesRepository.find({where: {sender: {id}} || {receiver: {id}}});
    }
}
