import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// 1️⃣ Parse JSON first
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// 2️⃣ Parse cookies
app.use(cookieParser());

// 3️⃣ Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 4️⃣ Routes
import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

// 5️⃣ Catch invalid JSON errors (must come after express.json)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error("Malformed JSON in request:", err.message);
    return res.status(400).json({ message: "Invalid JSON format in request body" });
  }
  next(err);
});

// 6️⃣ 404 handler
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// 7️⃣ Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export { app };
