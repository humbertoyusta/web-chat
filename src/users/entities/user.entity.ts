import { IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

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
}