import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { AuthController } from '../../auth.controller';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [],
      providers: [],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it.todo('nothing more');
});
