// src/api/controllers/auth.test.ts

import request from 'supertest';
import express from 'express';
import apiRoutes from '../routes/index';
import prisma from '../../config/prisma';

const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

// We use describe to group tests for a specific feature
describe('Auth Routes', () => {

  // Clean up the database before each test
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  // Test case for successful registration
  it('should register a new user successfully', async () => {
    const newUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(newUser);

    // Assertions: Check if the result is what we expect
    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe(newUser.email);
    expect(response.body.user).not.toHaveProperty('password');
  });

  // Test case for trying to register an existing user
  it('should return 409 if user already exists', async () => {
    // First, create a user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'Password123!',
      });
      
    // Then, try to create the same user again
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'Password123!',
      });
      
    expect(response.status).toBe(409);
    expect(response.body.message).toBe('User with this email already exists');
  });
});