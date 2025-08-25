import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/user.controller";


const router = Router();

/**
 * @swagger
 * /api/auth/register:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * username:
 * type: string
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: Invalid input or user already exists
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Log in a user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * password:
 * type: string
 * responses:
 * 200:
 * description: Login successful, returns JWT token
 * 401:
 * description: Invalid credentials
 */
router.post("/login", loginUser);
router.post("/profile", getProfile)

export default router;