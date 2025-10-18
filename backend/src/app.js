import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";


const upload = multer({ dest: "tmp_uploads/" });

const app = express();


app.use(express.json({ limit: "50mb" }));      // or higher depending on ZIP size
app.use(express.urlencoded({ extended: true, limit: "50mb" }));



app.use(cookieParser());


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


import authRoutes from "./routes/authRoutes.js";
import kycRoutes from "./routes/kycRoutes.js"

app.use("/api/auth", authRoutes);
app.use("/api/kyc", kycRoutes); 


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
