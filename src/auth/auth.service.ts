/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SignInUserDto } from './dto/sign-in-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) { }

    async validateUser(user: SignInUserDto) {
        const userInDb = await this.usersService.findOneByUsername(user.username);
        if (userInDb && user.password == userInDb.password) {
            const { password, ...finalUser } = userInDb;
            return finalUser;
        }
        else {
            return null;
        }
    }
}
