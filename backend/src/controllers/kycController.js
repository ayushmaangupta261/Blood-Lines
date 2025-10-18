import crypto from "crypto";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

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
      return res.status(400).json({ error: "missing fields" });
    }

    // Decode
    const ctBuf = base64ToBuffer(ciphertext);
    const saltBuf = base64ToBuffer(salt);
    const ivBuf = base64ToBuffer(iv);

    // Derive key
    const key = crypto.pbkdf2Sync(passphrase, saltBuf, PBKDF2_ITERATIONS, KEY_LEN, DIGEST);

    // Extract tag and encrypted data
    if (ctBuf.length < 16) throw new Error("ciphertext too short");
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

    // Build result summary
    const result = {};
    for (const z of zipEntries) {
      const name = z.entryName;
      if (name.toLowerCase().endsWith(".xml") || name.toLowerCase().endsWith(".txt")) {
        const content = zip.readFile(z).toString("utf8");
        result[name] = content.slice(0, 3000); // preview only
      } else {
        result[name] = `extracted (size=${z.header.size})`;
      }
    }

    res.json({
      message: "Decrypted and extracted successfully",
      files: Object.keys(result),
      preview: result,
      extractedDir
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
