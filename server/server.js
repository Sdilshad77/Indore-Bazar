import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import { connectDB } from "./config/dbConfig.js";
import dns from "node:dns/promises";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load .env from project root (one level up from server/)
dotenv.config({ path: resolve(__dirname, "../.env") });

// Routes
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import shopOwnerRoutes from "./routes/shopOwnerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import chatBotRoutes from "./routes/chatBotRoutes.js";
import reviewController from "./controllers/reviewController.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Database
connectDB();

// Middleware
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/shop-owner", shopOwnerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/chat", chatBotRoutes);
app.get("/api/reviews/featured", reviewController.getFeaturedReviews);

// Home Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "WELCOME TO INDORE BAZAR API",
    });
});

// Health Check Route — shows which env vars are loaded
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        env: {
            MONGO_URI: !!process.env.MONGO_URI,
            JWT_SECRET: !!process.env.JWT_SECRET,
            GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
            CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
        }
    });


    
});

// Serve built React client in production (single SPA host)
import { existsSync } from "fs";

const clientDist = resolve(__dirname, "../client/dist");

if (existsSync(resolve(clientDist, "index.html"))) {
    app.use(express.static(clientDist));

    app.use((req, res, next) => {
        if (req.method === "GET" && !req.path.startsWith("/api/")) {
            return res.sendFile(resolve(clientDist, "index.html"));
        }
        next();
    });
}

// Error Handler
app.use(errorHandler);

// Server
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`.bgBlue.black);
});