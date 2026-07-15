import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { initCronJobs } from "./src/api/cron.js";

import authRoutes from "./src/api/auth.js";
import jobRoutes from "./src/api/jobs.js";
import aiRoutes from "./src/api/ai.js";
import resumeRoutes from "./src/api/resume.js";
import gmailRoutes from "./src/api/gmail.js";

dotenv.config();

// Lazy database connection state
let isDbConnected = false;
let dbError: Error | null = null;

export async function connectDB() {
  if (isDbConnected) return;
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    dbError = new Error("MONGODB_URI is not defined in environment variables. Database features will be unavailable.");
    throw dbError;
  }
  
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    isDbConnected = true;
    dbError = null;
    console.log("Connected to MongoDB successfully.");
  } catch (err: any) {
    dbError = err;
    console.warn("⚠️ Could not connect to MongoDB. Please ensure your MONGODB_URI is correct and the database is running. Database features will be disabled.");
    // We don't re-throw here so it doesn't crash the server or log ugly stack traces
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/resume", resumeRoutes);
  app.use("/api/gmail", gmailRoutes);

  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      db: isDbConnected ? "connected" : "disconnected",
      dbError: dbError?.message
    });
  });

  // Attempt initial DB connection (non-blocking)
  if (process.env.MONGODB_URI) {
    connectDB().catch(console.error);
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  initCronJobs();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
