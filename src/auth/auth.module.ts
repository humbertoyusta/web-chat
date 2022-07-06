import { AuthController } from './auth.controller';
import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule, 
    JwtModule.register({ 
      secret: 'secret', // ! TODO: use environment variable and config service
      signOptions: {expiresIn: '60s'},
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
