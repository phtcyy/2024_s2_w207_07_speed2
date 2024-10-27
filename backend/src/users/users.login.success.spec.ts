import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

// Define the test suite for successful user login
describe('UsersController - Login Success (e2e)', () => {
  let app: INestApplication;
  let usersService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users/login (POST) should login a user and return a token', () => {
    const token = 'jwt.token.here';
    usersService.login.mockResolvedValueOnce(token);

    return request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(HttpStatus.OK)
      .expect({ token });
  });

  afterAll(async () => {
    await app.close();
  });
});
