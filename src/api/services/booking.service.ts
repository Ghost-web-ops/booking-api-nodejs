// src/api/services/booking.service.ts

import prisma from "../../config/prisma";

export async function createNewBooking(bookingData: any) {
  const { propertyId, userId, startDate, endDate } = bookingData;

  // 1. Check for booking conflicts
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      propertyId: propertyId,
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      ],
    },
  });

  if (conflictingBooking) {
    throw new Error("Property is already booked for the selected dates.");
  }

  // 2. If no conflict, create the new booking
  const newBooking = await prisma.booking.create({
    data: {
      propertyId,
      userId,
      startDate,
      endDate,
    },
  });

  return newBooking;
}

// ... your createNewBooking function

export async function editExistingBooking(bookingId: string, userId: string, updateData: any) {
  const { startDate, endDate } = updateData;

  // 1. Find the booking to make sure it exists
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  // 2. IMPORTANT: Check if the user owns this booking
  if (booking.userId !== userId) {
    throw new Error("You are not authorized to edit this booking.");
  }

  // 3. Check for new date conflicts (excluding the current booking)
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      propertyId: booking.propertyId,
      id: { not: bookingId }, // Exclude the current booking from the check
      OR: [
        {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      ],
    },
  });

  if (conflictingBooking) {
    throw new Error("Property is already booked for the new selected dates.");
  }

  // 4. If everything is okay, update the booking
  const updatedBooking = await prisma.booking.update({
    where: { id: bookingId },
    data: {
      startDate,
      endDate,
    },
  });

  return updatedBooking;
}
// Add this function to your booking.service.ts file

export async function deleteExistingBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (booking.userId !== userId) {
    throw new Error("You are not authorized to delete this booking.");
  }

  await prisma.booking.delete({
    where: { id: bookingId },
  });

  return; // No data to return after deletion
}
// أضف هذه الدالة إلى ملف src/api/services/booking.service.ts

export async function findBookingsByUserId(userId: string) {
  return prisma.booking.findMany({
    where: {
      userId: userId, // الشرط هو أن يتطابق userId في جدول الحجوزات
    },
    // يمكنك إضافة include لجلب معلومات العقار مع كل حجز
    include: {
      property: {
        select: {
          name: true,
          pricePerNight: true,
        },
      },
    },
  });
}