import { AuthController } from './auth.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';                           
import { forwardRef } from '@nestjs/common';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    JwtModule.register({secret: 'secret'}),
    forwardRef(() => UsersModule), 
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('api/auth/(.*)')
      .forRoutes('');
  }
}
