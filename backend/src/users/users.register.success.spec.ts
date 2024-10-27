import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

// Define the test suite for successful user registration
describe('UsersController - Register Success (e2e)', () => {
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

  it('/users/register (POST) should register a user', () => {
    usersService.register.mockResolvedValueOnce({ email: 'test@example.com' });

    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        role: 'Submitter',
      })
      .expect(HttpStatus.CREATED)
      .expect({ message: 'User registered successfully' });
  });

  afterAll(async () => {
    await app.close();
  });
});
