import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser } from './entities/user.entity';

@Injectable() // Mark the class as a provider
export class UsersService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>, // Inject the User model
  ) {}

  // Validate if user exists and password is correct
  async validateUser(email: string, password: string) {
    console.log(email, password)
    const user = await this.userModel.findOne({ email }).exec(); // Find user by email
    if (user && await bcrypt.compare(password, user.password)) { // Check if user exists and password matches
      return user; // Return the user if validation is successful
    }
    return null; // Return null if validation fails
  }

  // Login user and generate JWT
  async login(email: string, password: string): Promise<string | null> {
    const user = await this.validateUser(email, password); // Validate user credentials
    if (user) {
      const token = jwt.sign(
        { email: user.email, role: user.role }, // Payload for the token
        process.env.JWT_SECRET, // Use environment variable for secret
        { expiresIn: '1h' } // Set token expiration time
      );
      return token; // Return the generated token
    }
    return null; // Return null if credentials are invalid
  }

  // Register new user
  async register(email: string, password: string, role: string): Promise<any> {
    const existingUser = await this.userModel.findOne({ email }).exec(); // Check if the user already exists
    if (existingUser) {
      return null; // Return null if user exists
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = new this.userModel({ // Create a new user instance
      email,
      password: hashedPassword,
      role,
    });
    return newUser.save(); // Save the new user to the database
  }
}