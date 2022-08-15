import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
export declare class ContactsService {
    private readonly usersService;
    constructor(usersService: UsersService);
    addContact(userId: number, newContactId: number): Promise<boolean>;
    getContacts(userId: number): Promise<User[]>;
}
