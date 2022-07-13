import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto } from '../auth/dto/sign-up-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UpdateUserDto } from '../auth/dto/update-user.dto';

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

    /**
     * Returns a list with all the users (note that includes password hashes)
     */
    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }
    /**
     * Finds a user given an id (note that includes password hash)
     * @param reqId 
     * @returns the required user or undefined if no user is found
     */
    async findOne(reqId: number): Promise<User> {
        return await this.usersRepository.findOne({
            where: {id: reqId},
        });
    }

    /**
     * Finds a user given an username (note that includes password hash)
     * @param reqUsername 
     * @returns the required user or undefined if no user is found
     */
    async findOneByUsername(reqUsername: string): Promise<User> {
        return await this.usersRepository.findOne({
            where: {username: reqUsername},
        });
    }

    /**
     * Creates a new user (also hashes the password)
     * @param user
     * @returns the user created
     */
    async createUser(user: SignUpUserDto): Promise<User> {
        return await this.usersRepository.save(await this.hashPassword(user));
    }

    /**
     * deletes a user
     * @param user 
     * @returns the deleted user or undefined if no user is deleted
     */
    async deleteUser(user: User): Promise<User> {
        const deleteResult = await this.usersRepository.createQueryBuilder()
            .delete()
            .whereInIds(user.id)
            .returning('id')
            .execute();
        switch (deleteResult.affected) {
            case 0:
                return undefined;
            case 1:
                if (deleteResult.raw[0].id === user.id)
                    return user;
                else
                    throw new InternalServerErrorException();
            default:
                throw new InternalServerErrorException();
        }
    }

    /**
     * updates a user (if you set a new password, it will be hashed)
     * @param id - id of the user to update
     * @param updUser - data to update from the user
     * @returns the updated user or undefined if no user is updated
     */
    async updateUser(id: number, updUser: UpdateUserDto) {
        if (updUser.hasOwnProperty('password'))
            updUser = await this.hashPassword(updUser);

        const updatedUser = await this.usersRepository.preload({
            id: +id,
            ...updUser,
        });
        if (updatedUser)
            return await this.usersRepository.save(updatedUser);
        else 
            return undefined;
    }
}
