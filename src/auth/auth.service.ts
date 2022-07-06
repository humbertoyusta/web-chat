/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(user: SignUpUserDto) {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (!userInDb) {
            return this.usersService.createUser(user);
        }
        else {
            throw new ConflictException('There is a registered user with that username');
        }
    }

    async signIn(user: SignInUserDto) {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (userInDb && user.password === userInDb.password) {
            return {
                access_token: this.jwtService.sign({
                    user: user.username,
                    password: user.password,
                })
            };
        }
        else {
            throw new UnauthorizedException('Incorrect username or password');
        }
    }
}
