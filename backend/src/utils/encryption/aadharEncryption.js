import crypto from "crypto";

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(process.env.AADHAAR_SECRET, "salt", 32); // 32 bytes key

export const encryptAadhaar = (aadhaar) => {
  const iv = crypto.randomBytes(16); // unique IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(aadhaar.toString(), "utf8", "hex");
  encrypted += cipher.final("hex");
  return { iv: iv.toString("hex"), data: encrypted };
};

export const decryptAadhaar = (encrypted) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encrypted.iv, "hex")
  );
  let decrypted = decipher.update(encrypted.data, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Function to mask Aadhaar for display
export const maskAadhaar = (aadhaar, visibleDigits = 8) => {
  return aadhaar.toString().substring(0, visibleDigits).padEnd(12, "X");
};
