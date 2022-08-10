import { IsString } from "class-validator";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    @IsString()
    username: string;

    @Column()
    @IsString()
    passwordHash: string;

    @ManyToMany(() => User, (user) => user.id)
    @JoinTable()
    contacts: User[];
}