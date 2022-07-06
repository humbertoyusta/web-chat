import { IsString } from 'class-validator';

export class SignUpUserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;
}