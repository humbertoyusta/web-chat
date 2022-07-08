import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('api/auth/(.*)', 'api/auth')
      .forRoutes('');
  }
}
