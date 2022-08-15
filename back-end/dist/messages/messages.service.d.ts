import { Repository } from 'typeorm';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Message } from './entities/message.entity';
export declare class MessagesService {
    private readonly messagesRepository;
    constructor(messagesRepository: Repository<Message>);
    send(senderId: number, receiverId: number, text: string): Promise<{
        text: string;
        sender: {
            id: number;
        };
        receiver: {
            id: number;
        };
    } & Message>;
    findAll(id: number, paginationQueryDto: PaginationQueryDto, options?: {
        onlySent?: boolean;
        onlyReceived?: boolean;
    }): Promise<Message[]>;
}
