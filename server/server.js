// server/server.js
import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

//TEST SERVER.JS TO CHECK IF BACKEND IS CONNECTED TO SUPABASE

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Set-up Module Exports



// Simple route to verify backend is running
app.get("/", (req, res) => {
    res.send("Backend is running ✅");
});

// Optional route to test Supabase connection
app.get("/test-db", async (req, res) => {
    try {
        const { data, error } = await supabase.from("YOUR_TABLE_NAME").select("*").limit(1);
        if (error) throw error;
        res.json({ message: "Supabase connection successful ✅", data });
    } catch (err) {
        console.error("Supabase error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
