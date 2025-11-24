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
import { createClient } from "@supabase/supabase-js" // Placeholder for until we refactor to ./config/supabase.js
import { supabaseAdmin } from "./config/supabase.js";
import { authMiddleware } from "./middleware/auth.js";
import { mainRouter } from "./routes/index.ts";

// Load environment variables from .env file
/*
    To run this server:

    Install tsx (npm install --run-dev tsx)
    Run this file using the command "npx tsx server.js"
*/
dotenv.config();

export const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ==================== MIDDLEWARE ====================

app.use(cors()); // Enable CORS for frontend requests (allows cross-origin API calls)
app.use(express.json({ limit: '50mb' })); // Parse JSON request bodies with 50MB limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded form data with 50MB limit

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

// Connect main router to the app.
app.use(mainRouter);

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

// ==================== SERVER STARTUP ====================

// Start the Express server and listen on the configured port
app.listen(PORT, () => {
    console.log(`
🚀 CNCT Backend Running!
📍 http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/
    `);
});
