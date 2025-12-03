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
 * - WebSocket connections for real-time notifications
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "./config/supabase.js";
import { authMiddleware } from "./middleware/auth.js";
import { mainRouter } from "./routes/index.ts";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables from .env file
/*
    To run this server:

    Install tsx (npm install --run-dev tsx)
    Run this file using the command "npx tsx server.js"
*/
dotenv.config();

export const app = express();
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ==================== MIDDLEWARE ====================

app.use(cors()); // Enable CORS for frontend requests (allows cross-origin API calls)
app.use(express.json({ limit: '5mb' })); // Parse JSON request bodies with 5MB limit for image uploads
app.use(express.urlencoded({ extended: true, limit: '5mb' })); // Parse URL-encoded form data with 5MB limit

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

// Connect main router to the app
app.use(mainRouter);

// ==================== ERROR HANDLERS ====================

// 404 and error handling middleware
app.use(notFound);
app.use(errorHandler);

// ==================== SERVER STARTUP ====================

// Start the Express server and listen on the configured port
httpServer.listen(PORT, () => {
    console.log(`
🚀 CNCT Backend Running!
📍 http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/
    `);
});

// ==================== Websockets ====================

//Use JWT token as websocket identifier to verify websocket connection with the supplied UID.
//Any connections that try to fake will be rejected due to invalid JWT token

/*interface AuthData {
    JWT: string;
    UUID: string;
}
*/

var websockets = [];
const websocketServer = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});


websocketServer.on("connection", (socket) => {
    //Verify JWT on websocket connection
    socket.emit("authRequest","", async (authData) => {
        //Client needs to implement Callback, not implemented yet.
        const claims = await JWTData(authData.JWT);
        if (claims) {
            socket.id = claims.claims.session_id;
            websockets.push(socket);
            initializeWebSocketEvents(socket);
            //deliver all current notifications to the user. Is not yet implemented, needs to be made in repository.
            //socket.emit("notifications",getUnreadNotificationsFromUUID(socket.id));
        }
        else {
            socket.emit("error","Invalid JWT");
            socket.disconnect(true);
        }
    });



});

function initializeWebSocketEvents(socket) {
    socket.on("readNotification", (notificationData) => {
        //Insert update notification repository when made.
    });
    socket.on("deleteNotification", (notificationData) => {
        //Insert update notification repository when made.
    });
}

//Return JWT data (claims)
async function JWTData(JWT) {
    const { data, error } = await supabase.auth.getClaims(JWT);
    if(error) {
        console.log("Failed to find JWT. Error: ");
        console.log(error);
    }
    return data;

}
//Push a notification if user's websocket is found.
export function pushNotification(userId, notification) {
    notifeeSocket = websockets.find(websocket => websocket.id === userId);
    notifeeSocket?.emit("notification", notification);
}
