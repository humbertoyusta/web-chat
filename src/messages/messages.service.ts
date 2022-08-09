/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

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

    async findAll(id: number, options?: { onlySent?: boolean, onlyReceived?: boolean }): Promise<Message[]> {
        let messagesList: Message[] = [];
        if (options && options.onlySent && options.onlyReceived)
            return messagesList;
        else if (options && options.onlySent)
            messagesList = await this.messagesRepository.find({ where: { sender: { id } }, relations: ["receiver"], order: {sentAt: 1}});
        else if (options && options.onlyReceived)
            messagesList = await this.messagesRepository.find({ where: { receiver: { id } }, relations: ["receiver"] });
        else
            messagesList = await this.messagesRepository.find({ where: { sender: { id } } || { receiver: { id } }, relations: ["receiver"] });

        for (const message of messagesList) {
            const { passwordHash, ...receiverNoPass } = message.receiver;
            message.receiver = receiverNoPass as User;
        }

        return messagesList;
    }
}
