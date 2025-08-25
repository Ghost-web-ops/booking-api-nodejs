// src/api/routes/index.ts

import { Router } from 'express';
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';
import bookingRoutes from './booking.routes';

const router = Router();

// It tells the main router to use a prefix for each section
router.use('/auth', userRoutes); // All user routes will start with /auth
router.use('/properties', propertyRoutes); // All property routes will start with /properties
router.use('/bookings', bookingRoutes); // All booking routes will start with /bookings

export default router;