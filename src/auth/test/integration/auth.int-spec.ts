import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import appConfig from '../../../config/app.config';
import { AuthService } from '../../../auth/auth.service';
import { UsersModule } from '../../../users/users.module';
import { AuthController } from '../../auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../../../config/database.config';
import { ConflictException, INestApplication, UnauthorizedException } from '@nestjs/common';
import { SignUpUserDto } from '../../dto/sign-up-user.dto';
import { UserNoPassDto } from '../../../users/dto/user.no-pass.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { JwtTokenUserDto } from 'src/auth/dto/jwt-token-user.dto';
import { SignInUserDto } from 'src/auth/dto/sign-in-user.dto';

interface AccessToken {
  id: number,
  username: string,
  passwordHash: string,
  iat: number,
};

describe('AuthService Integration', () => {
  let authService: AuthService;
  let app: INestApplication;
  let jwtService: JwtService;

  const exampleSignUpUser: SignUpUserDto = {
    username: 'john',
    password: 'hf0hew1',
  };

  const exampleSignInUser: SignUpUserDto = {
    username: 'john',
    password: 'hf0hew1',
  };

  const exampleUpdateUser: UpdateUserDto = {
    username: 'jane',
    password: '3wef',
  };


  let exampleUserNoPass: UserNoPassDto;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot({
                load: [appConfig],
                envFilePath: '.env.test',
              }),
              TypeOrmModule.forRootAsync({
                imports: [ConfigModule.forFeature(databaseConfig)],
                inject: [databaseConfig.KEY],
                useFactory: async (dbConfig: ConfigType<typeof databaseConfig>) => {
                  return ({
                    type: 'postgres',
                    ...dbConfig,
                    synchronize: true,
                    autoLoadEntities: true,
                  });
                },
              }),
            JwtModule.registerAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: async (configService: ConfigService) => ({
                secret: configService.get('secretJwt'),
              }),
            }),
            UsersModule, 
          ],
          providers: [AuthService],
          controllers: [AuthController],
          exports: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    authService = app.get<AuthService>(AuthService);
    jwtService = app.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    describe('register a user', () => {
        it('should return the created user (without password)', async () => {
            const user: UserNoPassDto = await authService.signUp(exampleSignUpUser);
            expect(user.id).toBeGreaterThan(0);
            expect(user.username).toEqual(exampleSignUpUser.username);
            exampleUserNoPass = user;
        });
    });
    describe('if there is another user with the same username', () => {
      it('should throw conflict exception', async () => {
        await expect(authService.signUp(exampleSignUpUser))
          .rejects
          .toThrowError(new ConflictException('There is a registered user with that username'));
      });
    });
  });

  describe('signIn', () => {
    describe('when everything is correct', () => {
      it('should return a valid jwt token', async () => {
        const {access_token} = await authService.signIn(exampleSignInUser);
        const unWrappedToken: AccessToken = await jwtService.verify(access_token);
        const {passwordHash, iat, ...loggedUser} = unWrappedToken;
        expect(loggedUser as UserNoPassDto).toEqual(exampleUserNoPass);
        expect(await bcrypt.compare(exampleSignInUser.password, passwordHash)).toEqual(true);
      });
    });
    describe('when password is incorrect', () => {
      it('should throw unauthorized exception', async () => {
        await expect(authService.signIn({...exampleSignInUser, password: 'wrongpassword'}))
          .rejects
          .toThrowError(new UnauthorizedException('Incorrect username or password'));
      });
    });
    describe('when username does not exist', () => {
      it('should throw unauthorized exception', async () => {
        await expect(authService.signIn({...exampleSignInUser, username: 'notanusername'}))
          .rejects
          .toThrowError(new UnauthorizedException('Incorrect username or password'));
      });
    });
  });

  describe('updateUser', () => {
    describe('when only username changes', () => {
      it('should return the updated user', async () => {
        const updatedUser = await authService.updateUser(exampleUserNoPass.id, {username: exampleUpdateUser.username} as UpdateUserDto);
        expect(updatedUser).toEqual({...exampleUserNoPass, username: exampleUpdateUser.username});
      });
      it('should be possible to sign in with new username', async () => {
        const {access_token} = await authService.signIn({...exampleSignInUser, username: exampleUpdateUser.username} as SignInUserDto);
      });
    });
    describe('when only password changes', () => {
      it('should return the updated user', async () => {
        const updatedUser = await authService.updateUser(exampleUserNoPass.id, {password: exampleUpdateUser.password} as UpdateUserDto);
        expect(updatedUser).toEqual({...exampleUserNoPass, username: exampleUpdateUser.username});
      });
      it('should be possible to sign in with new password', async () => {
        const {access_token} = await authService.signIn(exampleUpdateUser as SignInUserDto);
      });
    });
  });

  describe('deleteUser', () => {
    describe('when password is incorrect', () => {
      it('should throw UnauthorizedException', async() => {
        await expect(authService.deleteUser(exampleUserNoPass.id, 'wrong-password'))
          .rejects
          .toThrowError(new UnauthorizedException('Incorrect username or password'));
      });
    });
    describe('when everything is correct', () => {
      it('should return the deleted user (without password)', async() => {
        const deletedUser = await authService.deleteUser(exampleUserNoPass.id, exampleUpdateUser.password);
        expect(deletedUser).toEqual({...exampleUserNoPass, username: exampleUpdateUser.username} as UserNoPassDto);
      });
    });
    describe('when user does not exists (for example, if it is already deleted)', () => {
      it('should throw UnauthorizedException', async() => {
        await expect(authService.deleteUser(exampleUserNoPass.id, exampleUpdateUser.password))
          .rejects
          .toThrowError(new UnauthorizedException('Incorrect username or password'));
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
