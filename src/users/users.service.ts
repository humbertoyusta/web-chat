import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from 'src/auth/dto/sign-up-user.dto';
import { Repository } from 'typeorm';
import { UserNoPassDto } from './dto/user.no-pass.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {}

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
        const hash = await bcrypt.hash(user.password, this.configService.get<number>('bcryptSaltRounds'));
        const {password, ...toDbUser} = {...user, passwordHash: hash};
        return await this.usersRepository.save(toDbUser);
    }

    async deleteUser(user: User): Promise<User> {
        await this.usersRepository.delete({id: user.id});
        return user;
    }
}
