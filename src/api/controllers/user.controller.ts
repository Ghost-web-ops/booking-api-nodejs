// src/api/controllers/auth.controller.ts

import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { z } from "zod"; // 1. استيراد zod هنا
import * as userService from "../services/user.service"; // استيراد كل الدوال من الـ service

// 2. إنشاء مخطط للتحقق من صحة بيانات التسجيل
const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function registerUser(req: Request, res: Response) {
  try {
    // 3. التحقق من صحة جسم الطلب أولاً
    const validatedData = registerSchema.parse(req.body);

    // 4. إذا نجح التحقق، قم باستدعاء الـ service بالبيانات النظيفة
    const newUser = await userService.registerNewUser(validatedData);
    
    return res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error: any) {
    // هذا سيلتقط أخطاء التحقق من zod
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data provided", issues: error.issues });
    }

    // هذا سيلتقط الأخطاء من الـ service (مثال: "المستخدم موجود بالفعل")
    if (error.message === "User with this email already exists") {
      return res.status(409).json({ message: error.message });
    }
    
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// 5. إنشاء مخطط لتسجيل الدخول أيضًا
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1), // كلمة المرور مطلوبة
});

export async function loginUser(req: Request, res: Response) {
  try {
    // التحقق من صحة بيانات تسجيل الدخول
    const validatedData = loginSchema.parse(req.body);

    const token = await userService.loginExistingUser(validatedData);
    
    return res.json({ message: "Login successful", token });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid data provided", issues: error.issues });
    }
    if (error.message === "Invalid credentials") {
      return res.status(401).json({ message: error.message });
    }
    
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// ... دالة getProfile الخاصة بك
// The getProfile function is simple and doesn't need a service
export async function getProfile(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json({ message: "Welcome to your profile!", user: req.user });
}