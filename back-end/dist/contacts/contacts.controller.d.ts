import { ContactsService } from './contacts.service';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    addContact(userId: number, newContactId: number): Promise<void>;
    getContacts(userId: number): Promise<import("../users/entities/user.entity").User[]>;
}
