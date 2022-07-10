/*
https://docs.nestjs.com/fundamentals/testing#unit-testing
*/

import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SignUpUserDto } from '../auth/dto/sign-up-user.dto';
import { DataSource, Repository } from 'typeorm';
import { UserNoPassDto } from './dto/user.no-pass.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import appConfig from '../config/app.config';
import { InternalServerErrorException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const queryBuilder = {
    delete: jest.fn().mockReturnThis(),
    whereInIds: jest.fn().mockReturnThis(),
    returning: jest.fn().mockReturnThis(),
    execute: jest.fn(),
}
const createMockRepository = <T = any>(): MockRepository<T> => ({
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    createQueryBuilder: jest.fn(() => queryBuilder),
});

describe('UsersService', () => {
    let usersService: UsersService;
    let usersRepository: MockRepository<User>;

    const exampleUser: User = {
        id: 1,
        username: 'john',
        passwordHash: '2z9uvbuej9u4rh9fwkf9hf234uf',
    }

    const exampleUserNoPass: UserNoPassDto = {
        id: 1,
        username: 'john',
    }

    const exampleSignUpUser: SignUpUserDto = {
        username: 'john',
        password: '83hr023',
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [appConfig]
                }),
            ], // Add
            controllers: [], // Add
            providers: [
                { provide: DataSource, useValue: {} },
                {
                    provide: getRepositoryToken(User), 
                    useValue: createMockRepository()
                },
                UsersService,
            ],   // Add
        }).compile();

        usersService = moduleRef.get<UsersService>(UsersService);
        usersRepository = moduleRef.get<MockRepository<User>>(getRepositoryToken(User));
    });

    it('should be defined', () => {
        expect(usersService).toBeDefined();
        expect(usersRepository).toBeDefined();
        expect(usersRepository.find).toBeDefined();
    });

    describe('findAll', () => {
        it('should return a list of users', async () => {
            usersRepository.find.mockReturnValue([exampleUser]);

            const usersList: User[] = await usersService.findAll();

            expect(usersList).toEqual([exampleUser]);
        });
    });

    describe('findOne', () => {
        describe('when the user with required id exists', () => {
            it('should return the user', async () => {
                usersRepository.findOne.mockReturnValue(exampleUser);

                const foundUser: User = await usersService.findOne(exampleUser.id);

                expect(foundUser).toEqual(exampleUser);
            });
        });
        describe('when the user with required id does not exist', () => {
            it ('should return undefined', async () => {
                usersRepository.findOne.mockReturnValue(undefined);

                const foundUser: User = await usersService.findOne(-exampleUser.id);

                expect(foundUser).toBeUndefined();
            });
        });
    });

    describe('findOneByUsername', () => {
        describe('when the user with required id exists', () => {
            it('should return the user', async () => {
                usersRepository.findOne.mockReturnValue(exampleUser);

                const foundUser: User = await usersService.findOneByUsername(exampleUser.username);

                expect(foundUser).toEqual(exampleUser);
            });
        });
        describe('when the user with required id does not exist', () => {
            it ('should return undefined', async () => {
                usersRepository.findOne.mockReturnValue(undefined);

                const foundUser: User = await usersService.findOneByUsername(exampleUser.username + "pra");

                expect(foundUser).toBeUndefined();
            });
        });
    });

    describe('createUser', () => {
        it('should return the created user with hashed password', async () => {
            usersRepository.save.mockReturnValue(exampleUser);

            const createdUser: User = await usersService.createUser(exampleSignUpUser);

            let {passwordHash, ...createdUserNoPass} = createdUser;

            expect(createdUserNoPass as UserNoPassDto).toEqual(exampleUserNoPass);
            expect(bcrypt.compare(exampleSignUpUser.password, passwordHash));
        });
    });

    describe('deleteUser', () => {
        describe('when it is deleted properly', () => {
            it('should return the deleted user', async () => {
                usersRepository.createQueryBuilder()
                    .execute
                    .mockReturnValue({raw: [{id: 1}], affected: 1});
                
                const deletedUser = await usersService.deleteUser(exampleUser);

                expect(deletedUser).toEqual(exampleUser);
            })
        });
        describe('when the user is not found', () => {
            it('should return undefined', async () => {
                usersRepository.createQueryBuilder()
                    .execute
                    .mockReturnValue({raw: [], affected: 0});
                
                const deletedUser = await usersService.deleteUser(exampleUser);

                expect(deletedUser).toBeUndefined();
            });
        });
        describe('when another user is deleted', () => {
            it('should throw internal server error', async () => {
                usersRepository.createQueryBuilder()
                    .execute
                    .mockReturnValue({raw: [{id: -1}], affected: 1});
                
                await expect(usersService.deleteUser(exampleUser))
                    .rejects
                    .toThrowError(new InternalServerErrorException());
            });
        });
        describe('when more than one user is deleted', () => {
            it('should throw internal server error', async () => {
                usersRepository.createQueryBuilder()
                    .execute
                    .mockReturnValue({raw: [{id: 1}, {id: 2}], affected: 2});
                
                await expect(usersService.deleteUser(exampleUser))
                    .rejects
                    .toThrowError(new InternalServerErrorException());
            });
        });
    });
});
