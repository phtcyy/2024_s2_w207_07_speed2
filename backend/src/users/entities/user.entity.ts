import { Schema, Document } from 'mongoose'; // Import necessary modules from Mongoose

// Define IUser interface using Mongoose's Document interface
export interface IUser extends Document {
  email: string; // User's email address
  password: string; // User's hashed password
  role: string; // User's role (Submitter, Moderator, Analyst)
}

// Define Mongoose user model schema
export const UserSchema = new Schema({
  email: { type: String, required: true, unique: true }, // Email field must be unique and is required
  password: { type: String, required: true }, // Password field is required
  role: { 
    type: String, // Role field can be one of the predefined roles
    enum: ['Submitter', 'Moderator', 'Analyst'], // Allowed values for role
    default: 'Submitter' // Default role assigned to new users
  },
});
