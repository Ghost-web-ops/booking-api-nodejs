// src/middleware/auth.ts
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma";
import { User } from '@prisma/client';

export interface AuthRequest extends Request {
  user?: Omit<User, 'password'>;
}
// لو فضلت تحميل dotenv هنا، تمام؛ لكن الأفضل تحميله في نقطة الدخول للتطبيق.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  // لو اشتغلت على dev، ممكن تطبع تحذير؛ في الإنتاج يفضّل أن التطبيق لا يقلع.
  console.error("JWT_SECRET is not set. Authentication will fail.");
}

export type MyJwtPayload = JwtPayload & {
 userId?: string
  // أي خصائص تانية: email?: string, role?: string, ...
};

export interface AuthenticatedRequest extends Request {
  user?: MyJwtPayload | string;
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // نتوقع "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return res.status(401).json({ message: "Malformed token" });
  }

  const token = parts[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: "Server misconfigured" });
  }

  try {
    // استعمل cast لأن verify ممكن يرجع string | JwtPayload
    const decoded = jwt.verify(token, JWT_SECRET) as MyJwtPayload;
      const user = await prisma.user.findUnique({ where: { id: decoded.userId }});
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

    req.user = decoded;
    return next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
// يمكنك استيراد authMiddleware في أي راوتر أو كنترولر تحتاج فيه حماية المسارات
// وتطبيقه كـ middleware قبل المعالجات الخاصة بالمسار.