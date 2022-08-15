import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    send(senderId: number, receiverId: number, message: {
        text: string;
    }): Promise<{
        text: string;
        sender: {
            id: number;
        };
        receiver: {
            id: number;
        };
    } & Message>;
    findAll(id: string, paginationQueryDto: PaginationQueryDto): Promise<Message[]>;
    findAllSent(id: string, paginationQueryDto: PaginationQueryDto): Promise<Message[]>;
    findAllReceived(id: string, paginationQueryDto: PaginationQueryDto): Promise<Message[]>;
}
