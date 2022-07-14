import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule, ConfigType } from '@nestjs/config';
import appConfig from '../src/config/app.config';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from '../src/config/database.config';
import { APP_PIPE } from '@nestjs/core';
import { AuthController } from '../src/auth/auth.controller';
import { SignUpUserDto } from '../src/auth/dto/sign-up-user.dto';
import { SignInUserDto } from 'src/auth/dto/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';

describe('App (e2e)', () => {
  let app: INestApplication;
  let authController: AuthController;

  const signUpUserA: SignUpUserDto = {
    username: 'A',
    password: 'A',
  }

  const signUpUserB: SignUpUserDto = {
    username: 'B',
    password: 'B',
  }

  let jwtTokenA: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [appConfig],
          envFilePath: '.env.test',
        }),
        UsersModule, 
        AuthModule,
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
      ],
      providers: [
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
              enableImplicitConversion: true,
            },
          }),
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('AppController', () => {
    describe('signUp', () => {
      describe('sign up an user A', () => {
        it('should create the user', async () => {
          return await request(app.getHttpServer())
                  .post('/api/auth/sign-up')
                  .send(signUpUserA)
                  .expect(HttpStatus.CREATED);
        });
      });
      describe('sign up user A again', () => {
        it('should return HttpStatus CONFLICT', async () => {
          return await request(app.getHttpServer())
                  .post('/api/auth/sign-up')
                  .send(signUpUserA)
                  .expect(HttpStatus.CONFLICT);
        });
      });
      describe('sign up an user B', () => {
        it('should create the user', async () => {
          return await request(app.getHttpServer())
                  .post('/api/auth/sign-up')
                  .send(signUpUserB)
                  .expect(HttpStatus.CREATED);
        });
      });
    });

    describe('signIn', () => {
      describe('signIn with wrong password', () => {
        it('should return HttpStatus.UNAUTHORIZED', async () => {
          return await request(app.getHttpServer())
                        .post('/api/auth/sign-in')
                        .send({...signUpUserA, password: 'wrong-pass'} as SignInUserDto)
                        .expect(HttpStatus.UNAUTHORIZED);
        });
      });
      describe('signIn A', () => {
        it('should return a jwt token', async () => {
          return await request(app.getHttpServer())
                        .post('/api/auth/sign-in')
                        .send(signUpUserA as SignInUserDto)
                        .expect(HttpStatus.CREATED)
                        .then((request) => {
                          jwtTokenA = request.body.access_token;
                        });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
