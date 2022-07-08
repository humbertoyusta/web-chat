/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNoPassDto } from 'src/users/dto/user.no-pass.dto';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(user: SignUpUserDto) {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (!userInDb) {
            const {passwordHash, ...responseUser} = await this.usersService.createUser(user);
            return responseUser as UserNoPassDto;
        }
        else {
            throw new ConflictException('There is a registered user with that username');
        }
    }

    private async validateUser(user: SignInUserDto): Promise<User> {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (userInDb && await bcrypt.compare(user.password, userInDb.passwordHash)) {
            return userInDb;
        }
        else {
            throw new UnauthorizedException('Incorrect username or password');
        }
    }

    async signIn(user: SignInUserDto) {
        const validatedUser = await this.validateUser(user);
        return {
            access_token: this.jwtService.sign({
                user: validatedUser.username,
                password: validatedUser.passwordHash,
            })
        };
    }

    async deleteUser(user: SignInUserDto) {
        const validatedUser = await this.validateUser(user);
        const {passwordHash, ...responseUser} = await this.usersService.deleteUser(validatedUser);
        return responseUser as UserNoPassDto;
    }
}
