import { Request } from 'express';
import { UserNoPassDto } from '../users/dto/user.no-pass.dto';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { JwtService } from '@nestjs/jwt';
import { OnlyPasswordDto } from './dto/only-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthController {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    signUp(user: SignUpUserDto): Promise<UserNoPassDto>;
    signIn(user: SignInUserDto): Promise<{
        access_token: string;
    }>;
    deleteUser(request: Request, { password }: OnlyPasswordDto): Promise<UserNoPassDto>;
    updateUser(request: Request, updUser: UpdateUserDto): Promise<UserNoPassDto>;
}
