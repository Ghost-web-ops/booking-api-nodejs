// src/api/controllers/booking.controller.ts

import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { createNewBooking } from "../services/booking.service";
import { editExistingBooking } from "../services/booking.service"; // Import the new service function
import { deleteExistingBooking } from "../services/booking.service";
import { findBookingsByUserId } from "../services/booking.service"; // استيراد الخدمة الجديدة

type BookingBody = {
  propertyId: string;
  startDate: string; // Dates will come as strings from JSON
  endDate: string;
};

export async function createBooking(req: AuthRequest, res: Response) {
  const { propertyId, startDate, endDate } = req.body as BookingBody;
  const userId = req.user?.id; // Get the user ID from the authenticated user

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!propertyId || !startDate || !endDate) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const bookingData = {
      propertyId,
      userId,
      startDate: new Date(startDate), // Convert string to Date object
      endDate: new Date(endDate),
    };

    const newBooking = await createNewBooking(bookingData);

    return res
      .status(201)
      .json({ message: "Booking created successfully", booking: newBooking });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

// ... your createBooking function

export async function editBooking(req: AuthRequest, res: Response) {
  const bookingId = req.params.id;
  const userId = req.user?.id;
  const { startDate, endDate } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const updatedBooking = await editExistingBooking(bookingId, userId, {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return res.json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
// Add this function to your booking.controller.ts file


export async function deleteBooking(req: AuthRequest, res: Response) {
  const bookingId = req.params.id;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    await deleteExistingBooking(bookingId, userId);
    return res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
// أضف هذه الدالة إلى ملف src/api/controllers/booking.controller.ts



export async function getMyBookings(req: AuthRequest, res: Response) {
  const userId = req.user?.id; // نحصل على هوية المستخدم من التوكن

  if (!userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    const bookings = await findBookingsByUserId(userId);
    return res.json(bookings);
  } catch (error: any) {
    return res.status(500).json({ message: "Server error" });
  }
}