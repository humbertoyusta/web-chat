import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from 'src/auth/dto/sign-up-user.dto';
import { Repository } from 'typeorm';
import { UserNoPassDto } from './dto/user.no-pass.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>
    ) {}

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOneByUsername(reqUsername: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: {username: reqUsername},
        });
    }

    async createUser(user: SignUpUserDto): Promise<User> {
        return await this.usersRepository.save(user);
    }

    async deleteUser(user: User): Promise<User> {
        await this.usersRepository.delete({id: user.id});
        return user;
    }
}
