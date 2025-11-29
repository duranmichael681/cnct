// server/server.js
/**
 * CNCT Express Backend Server
 * 
 * This is the main entry point for the CNCT backend API.
 * It handles:
 * - API routing for posts, users, notifications, tags, and storage
 * - Authentication middleware for protected routes
 * - CORS configuration for frontend communication
 * - Database connection via Supabase
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { supabaseAdmin } from "./config/supabase.js";
import { authMiddleware } from "./middleware/auth.js";

// Import API route handlers
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";
import notificationsRouter from "./routes/notifications.js";
import tagsRouter from "./routes/tags.js";
import storageRouter from "./routes/storage.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

app.use(cors()); // Enable CORS for frontend requests (allows cross-origin API calls)
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data

// ==================== HEALTH CHECK ROUTES ====================

// Root endpoint - provides API information and available endpoints
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "CNCT Backend API is running ✅",
        version: "1.0.0",
        endpoints: {
            posts: "/api/posts",
            users: "/api/users",
            notifications: "/api/notifications",
            tags: "/api/tags",
            storage: "/api/storage",
        }
    });
});

// Database connection test endpoint - verifies Supabase connectivity
app.get("/test-db", async (req, res) => {
    try {
        const { data, error } = await supabaseAdmin
            .from("profiles")
            .select("id")
            .limit(1);
        
        if (error) throw error;
        
        res.json({
            success: true,
            message: "Supabase connection successful ✅",
            connectedTo: process.env.SUPABASE_URL
        });
    } catch (err) {
        console.error("Supabase connection error:", err.message);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// ==================== API ROUTES ====================

/**
 * All routes are prefixed with their respective paths.
 * authMiddleware is applied to routes that require user authentication.
 * 
 * Route Structure:
 * - /api/posts        - Post management (CREATE, READ, attendance)
 * - /api/users        - User profile operations
 * - /api/notifications - User notification management
 * - /api/tags         - Tag/category operations
 * - /api/storage      - File upload/download (images)
 */

app.use("/api/posts", authMiddleware, postsRouter);         // Protected: requires auth token
app.use("/api/users", usersRouter);                          // Public: user profile reads
app.use("/api/notifications", authMiddleware, notificationsRouter); // Protected: user-specific
app.use("/api/tags", tagsRouter);                            // Public: tag browsing
app.use("/api/storage", authMiddleware, storageRouter);      // Protected: file uploads

// ==================== ERROR HANDLERS ====================

// 404 handler - catches requests to undefined routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        path: req.path
    });
});

// Global error handler - catches all unhandled errors
app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({
        success: false,
        error: "Internal server error",
        message: err.message
    });
});

// 404 and error handling middleware
app.use(notFound);
app.use(errorHandler);

// ==================== SERVER STARTUP ====================

// Start the Express server and listen on the configured port
app.listen(PORT, () => {
    console.log(`
🚀 CNCT Backend Running!
📍 http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/
    `);
});



