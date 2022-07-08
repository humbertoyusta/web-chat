/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNoPassDto } from 'src/users/dto/user.no-pass.dto';
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
            const {password, ...responseUser} = await this.usersService.createUser(user);
            return responseUser as UserNoPassDto;
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

    async deleteUser(user: SignInUserDto) {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (userInDb && user.password === userInDb.password) {
            const {password, ...responseUser} = await this.usersService.deleteUser(userInDb);
            return responseUser as UserNoPassDto;
        }
        else {
            throw new UnauthorizedException('Incorrect username or password');
        }
    }
}
