// src/api/services/user.service.ts

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../config/prisma";
import { User } from "@prisma/client";


// The "chef" for registering a user
export async function registerNewUser(userData: any): Promise<Omit<User, 'password'>> {
  const { username, email, password } = userData;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { username, email, password: hashedPassword },
    select: {
      id: true,
      username: true,
      email: true,
      role:true,
      createdAt: true,
      updatedAt: true,
      // You can add other fields here if you want them returned
    },
  });

  return newUser;
}

// The "chef" for logging in a user
export async function loginExistingUser(loginData: any): Promise<string> {
  const { email, password } = loginData;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, password: true },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Server misconfigured. JWT_SECRET is missing.");
  }

  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });
  return token;
}