import { IsString } from "class-validator";


export class UserNoPassDto {
    @IsString()
    id: number;

    @IsString()
    username: string;
}