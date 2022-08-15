import { SignUpUserDto } from '../auth/dto/sign-up-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../auth/dto/update-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    private readonly configService;
    constructor(usersRepository: Repository<User>, configService: ConfigService);
    private hashPassword;
    findAll(): Promise<User[]>;
    findOne(reqId: number, options?: {
        loadContacts?: boolean;
    }): Promise<User>;
    findOneByUsername(reqUsername: string): Promise<User>;
    createUser(user: SignUpUserDto): Promise<User>;
    deleteUser(user: User): Promise<User>;
    updateUser(id: number, updUser: UpdateUserDto): Promise<User>;
}
