import { IsString } from "class-validator";
import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (sender) => sender.id)
    sender: User;

    @ManyToOne(() => User, (receiver) => receiver.id)
    receiver: User;

    @Column()
    @IsString()
    text: string;

    @CreateDateColumn()
    sentAt: Date;
};