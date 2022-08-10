import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
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
    async findAll(
        @Param('id') id: string, 
        @Query() paginationQueryDto: PaginationQueryDto
    ): Promise<Message[]> {
        return await this.messagesService.findAll(+id, paginationQueryDto);
    }

    @Get(':id/sent')
    async findAllSent(
        @Param('id') id: string, 
        @Query() paginationQueryDto: PaginationQueryDto
    ): Promise<Message[]> {
        return await this.messagesService.findAll(+id, paginationQueryDto, {onlySent: true});
    }
    
    @Get(':id/received')
    async findAllReceived(
        @Param('id') id: string, 
        @Query() paginationQueryDto: PaginationQueryDto
    ): Promise<Message[]> {
        return await this.messagesService.findAll(+id, paginationQueryDto, {onlyReceived: true});
    }
}
