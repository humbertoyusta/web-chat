import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from 'src/auth/dto/sign-up-user.dto';
import { Repository } from 'typeorm';
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

    async createUser(user: SignUpUserDto): Promise<void> {
        await this.usersRepository.save(user);
    }

}
