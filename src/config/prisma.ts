// src/config/prisma.ts

import { PrismaClient } from '@prisma/client';

// إنشاء مثيل واحد من PrismaClient
const prisma = new PrismaClient();

// تصدير المثيل ليتم استخدامه في جميع أنحاء التطبيق
export default prisma;