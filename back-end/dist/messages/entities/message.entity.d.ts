import { User } from "src/users/entities/user.entity";
export declare class Message {
    id: number;
    sender: User;
    receiver: User;
    text: string;
    sentAt: Date;
}
