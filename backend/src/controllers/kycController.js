import crypto from "crypto";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { PDFDocument } from "pdf-lib";

const PBKDF2_ITERATIONS = 250000;
const KEY_LEN = 32;
const DIGEST = "sha256";

function base64ToBuffer(b64) {
  return Buffer.from(b64, "base64");
}

export const uploadEncryptedKYC = async (req, res) => {
  try {
    const { ciphertext, salt, iv, filename, passphrase } = req.body;

    if (!ciphertext || !salt || !iv || !passphrase) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Decode inputs
    const ctBuf = base64ToBuffer(ciphertext);
    const saltBuf = base64ToBuffer(salt);
    const ivBuf = base64ToBuffer(iv);

    // Derive key
    const key = crypto.pbkdf2Sync(passphrase, saltBuf, PBKDF2_ITERATIONS, KEY_LEN, DIGEST);

    // Extract auth tag & encrypted data
    const tag = ctBuf.slice(ctBuf.length - 16);
    const enc = ctBuf.slice(0, ctBuf.length - 16);

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, ivBuf);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(enc), decipher.final()]);

    // Save decrypted zip temporarily
    const tmpDir = path.join(process.cwd(), "tmp_uploads");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const zipPath = path.join(tmpDir, `${Date.now()}-${filename || "offline-eKYC.zip"}`);
    fs.writeFileSync(zipPath, decrypted);

    // Extract zip
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    const extractedDir = path.join(tmpDir, `extracted-${Date.now()}`);
    fs.mkdirSync(extractedDir);
    zip.extractAllTo(extractedDir, true);

    // Filter for images (jpg/jpeg/png)
    const images = zipEntries
      .filter(z => /\.(jpg|jpeg|png)$/i.test(z.entryName))
      .map(z => zip.readFile(z));

    // Ensure exactly 2 images (front & back)
    if (images.length !== 2) {
      return res.status(400).json({ error: "ZIP must contain exactly 2 images (front and back)" });
    }

    // Create PDF with two images
    const pdfDoc = await PDFDocument.create();
    for (const imgBuf of images) {
      let img;
      if (imgBuf[0] === 0xff && imgBuf[1] === 0xd8) {
        img = await pdfDoc.embedJpg(imgBuf);
      } else {
        img = await pdfDoc.embedPng(imgBuf);
      }
      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const pdfBuffer = await pdfDoc.save();
    const pdfPath = path.join(tmpDir, `${Date.now()}-kyc.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);

    res.json({
      message: "Decrypted, extracted and PDF created successfully",
      files: zipEntries.map(z => z.entryName),
      pdfPath: `tmp_uploads/${path.basename(pdfPath)}`,
      extractedDir
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
