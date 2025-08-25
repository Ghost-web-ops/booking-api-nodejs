// src/api/middlewares/admin.middleware.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware'; // نستورد نفس نوع الطلب المحمي

export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  // نفترض أن authMiddleware قد تم تشغيله قبله وأضاف req.user
  const user = req.user;

  if (user && user.role === 'ADMIN') {
    // إذا كان المستخدم موجوداً وهو مدير، اسمح للطلب بالمرور
    next();
  } else {
    // إذا لم يكن مديراً، أرجع خطأ "غير مصرح به"
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
}