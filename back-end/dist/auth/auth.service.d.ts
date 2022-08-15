import { JwtService } from '@nestjs/jwt';
import { UserNoPassDto } from '../users/dto/user.no-pass.dto';
import { UsersService } from '../users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    signUp(user: SignUpUserDto): Promise<UserNoPassDto>;
    private validateUser;
    private validateUserbyIdandPwd;
    signIn(user: SignInUserDto): Promise<{
        access_token: string;
    }>;
    deleteUser(id: number, password: string): Promise<UserNoPassDto>;
    updateUser(id: number, updUser: UpdateUserDto): Promise<UserNoPassDto>;
}
