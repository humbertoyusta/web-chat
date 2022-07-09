import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from 'src/auth/dto/sign-up-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {}

    private async hashPassword(userPlainPass : SignUpUserDto | UpdateUserDto) {
        const hash = await bcrypt.hash(userPlainPass.password, this.configService.get<number>('bcryptSaltRounds'));
        const {password, ...userHashPass} = {...userPlainPass, passwordHash: hash};
        return userHashPass;
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(reqId: number): Promise<User> {
        return await this.usersRepository.findOne({
            where: {id: reqId},
        });
    }

    async findOneByUsername(reqUsername: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: {username: reqUsername},
        });
    }

    async createUser(user: SignUpUserDto): Promise<User> {
        return await this.usersRepository.save(await this.hashPassword(user));
    }

    async deleteUser(user: User): Promise<User> {
        await this.usersRepository.delete({id: user.id});
        return user;
    }

    async updateUser(id: number, updUser: UpdateUserDto) {
        if (updUser.hasOwnProperty('password'))
            updUser = await this.hashPassword(updUser);

        const userInDb = await this.findOne(id);
        const updatedUser = await this.usersRepository.preload({
            ...userInDb,
            ...updUser,
        });
        return await this.usersRepository.save(updatedUser);
    }
}
