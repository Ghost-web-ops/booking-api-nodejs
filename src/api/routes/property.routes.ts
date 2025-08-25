// src/api/routes/property.routes.ts

import { Router } from "express";
import  authMiddleware  from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware"; // 1. استيراد الـ Middleware الجديد
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "../controllers/property.controller";

const router = Router();

// --- المسارات العامة (لا تتغير) ---
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

// --- المسارات المحمية للمدير فقط ---
// 2. أضف adminMiddleware بعد authMiddleware
router.post("/", authMiddleware, adminMiddleware, createProperty);
router.put("/:id", authMiddleware, adminMiddleware, updateProperty);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProperty);

export default router;