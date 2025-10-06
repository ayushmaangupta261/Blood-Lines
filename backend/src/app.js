import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


app.use(cookieParser());


app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error("Malformed JSON in request:", err.message);
    return res.status(400).json({ message: "Invalid JSON format in request body" });
  }
  next(err);
});


app.use((req, res) => res.status(404).json({ message: "Route not found" }));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

export { app };
