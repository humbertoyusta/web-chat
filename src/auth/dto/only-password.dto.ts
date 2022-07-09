import { IsNumber, IsPositive, IsString } from 'class-validator';

export class OnlyPasswordDto {
    @IsString()
    password: string;
}