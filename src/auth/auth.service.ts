/*
https://docs.nestjs.com/providers#services
*/

import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserNoPassDto } from 'src/users/dto/user.no-pass.dto';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtTokenUserDto } from './dto/jwt-token-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
        let userInDb: User = await this.usersService.findOneByUsername(user.username);

        if (userInDb && await bcrypt.compare(user.password, userInDb.passwordHash)) {
            return userInDb;
        }
        else {
            throw new UnauthorizedException('Incorrect username or password');
        }
    }

    private async validateUserbyIdandPwd(id: number, password: string) {
        let userInDb: User = await this.usersService.findOne(id);

        if (userInDb && await bcrypt.compare(password, userInDb.passwordHash)) {
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
                id: validatedUser.id,
                username: validatedUser.username,
                passwordHash: validatedUser.passwordHash,
            })
        };
    }

    async deleteUser(user: JwtTokenUserDto, password: string) {
        const validatedUser = await this.validateUserbyIdandPwd(user.id, password);
        const {passwordHash, ...responseUser} = await this.usersService.deleteUser(validatedUser);
        return responseUser as UserNoPassDto;
    }

    async updateUser(id: number, updUser: UpdateUserDto) {
        if (updUser.hasOwnProperty('username'))
            if (await this.usersService.findOneByUsername(updUser.username))
                throw new ConflictException('There is a registered user with that username');

        const {passwordHash, ...responseUser} = await this.usersService.updateUser(id, updUser);
        return responseUser as UserNoPassDto;
    }
}
