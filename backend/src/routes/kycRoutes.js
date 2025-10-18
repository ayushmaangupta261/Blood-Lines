
import express from "express";
import multer from "multer";
import { uploadEncryptedKYC } from "../controllers/kycController.js";

const router = express.Router();

// Multer setup
const upload = multer({ dest: "tmp_uploads/" });

// Route with Multer middleware
router.post("/upload-encrypted", upload.single("file"), uploadEncryptedKYC);

export default router;
