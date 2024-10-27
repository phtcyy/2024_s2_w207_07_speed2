import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

// Define the test suite for failed login attempt (invalid credentials)
describe('UsersController - Login Fail (e2e)', () => {
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

  it('/users/login (POST) should return error for invalid credentials', async () => {
    // Simulate login failure due to invalid credentials
    const invalidEmail = 'invalid@example.com';
    const wrongPassword = 'wrongpassword';
    
    usersService.login.mockResolvedValueOnce(null);

    // Send POST request to login
    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({
        email: invalidEmail,
        password: wrongPassword,
      })
      .expect(HttpStatus.UNAUTHORIZED) // Expect 401 Unauthorized status
      .expect({ message: 'Invalid credentials' }); // Expect error message

    // Log the reason for failure
    console.log(`Login failed for email: ${invalidEmail}, reason: Invalid credentials`);

    // Optionally check if response contains the expected message
    expect(response.body.message).toBe('Invalid credentials');
  });

  afterAll(async () => {
    await app.close();
  });
});
