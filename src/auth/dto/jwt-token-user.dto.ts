import { IsNumber, IsPositive, IsString } from 'class-validator';

export class JwtTokenUserDto {
    @IsNumber()
    @IsPositive()
    id: number;

    @IsString()
    username: string;

    @IsString()
    password: string;
}