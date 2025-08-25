// src/api/routes/booking.routes.ts

import { Router } from "express";
// أضف getMyBookings إلى السطر التالي
import { createBooking, editBooking, deleteBooking, getMyBookings } from "../controllers/booking.controller"; 
import  authMiddleware  from "../middlewares/auth.middleware";

const router = Router();

// إضافة المسار الجديد هنا
router.get("/my-bookings", authMiddleware, getMyBookings);

router.post("/", authMiddleware, createBooking);
router.put("/:id", authMiddleware, editBooking);
router.delete("/:id", authMiddleware, deleteBooking);

export default router;