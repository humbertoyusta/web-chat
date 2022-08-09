import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';

@Controller('api/messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
    ) {}

    @Post(':id1/:id2')
    async send(@Param('id1') senderId: number, @Param('id2') receiverId: number, @Body() message: {text: string}) {
        return await this.messagesService.send(senderId, receiverId, message.text);
    }

    @Get(':id')
    async findAll(@Param('id') id: number): Promise<Message[]> {
        return await this.messagesService.findAll(id);
    }

    @Get(':id/sent')
    async findAllSent(@Param('id') id: number): Promise<Message[]> {
        return await this.messagesService.findAll(id, {onlySent: true});
    }
    
    @Get(':id/received')
    async findAllReceived(@Param('id') id: string): Promise<Message[]> {
        return await this.messagesService.findAll(+id, {onlyReceived: true});
    }
}
