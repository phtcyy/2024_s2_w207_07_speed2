import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

// Define the test suite for failed user registration (existing user)
describe('UsersController - Register Existing User (e2e)', () => {
  let app: INestApplication;
  let usersService = {
    register: jest.fn(),
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

  it('/users/register (POST) should return error for existing user', () => {
    usersService.register.mockResolvedValueOnce(null);

    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'used@example.com',
        password: 'password123',
        role: 'Submitter',
      })
      .expect(HttpStatus.BAD_REQUEST)
      .expect({ message: 'User already exists' });
  });

  afterAll(async () => {
    await app.close();
  });
});
