import React, { useState } from "react";
import JSZip from "jszip";
import { uploadEncryptedKYC } from "../services/operations/kycApi.js";

const Dashboard = () => {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [status, setStatus] = useState("");
  const [preview, setPreview] = useState(null);

  // ================= Helper Functions =================
  async function generateSaltIv() {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    return { salt, iv };
  }

  async function deriveKey(passphrase, salt) {
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(passphrase),
      "PBKDF2",
      false,
      ["deriveKey"]
    );
    return window.crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 250000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
  }

  async function encryptData(dataBuffer, key, iv) {
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      dataBuffer
    );
    return new Uint8Array(encrypted);
  }

  function bufferToBase64(buf) {
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < buf.length; i += chunkSize) {
      const chunk = buf.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    return btoa(binary);
  }

  // ================= File Handling =================
  const handleFrontFile = (e) => setFrontFile(e.target.files[0] || null);
  const handleBackFile = (e) => setBackFile(e.target.files[0] || null);

  const handleSubmit = async () => {
    if (!frontFile || !backFile) {
      return alert("Please select both front and back images!");
    }

    const passphrase = prompt("Enter passphrase for encryption:");
    if (!passphrase) return;

    setStatus("Preparing ZIP and encrypting...");

    // Create ZIP
    const zip = new JSZip();
    zip.file(`front-${frontFile.name}`, await frontFile.arrayBuffer());
    zip.file(`back-${backFile.name}`, await backFile.arrayBuffer());

    const zipBlob = await zip.generateAsync({ type: "arraybuffer" });

    // Encrypt
    const { salt, iv } = await generateSaltIv();
    const key = await deriveKey(passphrase, salt);
    const encrypted = await encryptData(zipBlob, key, iv);

    const payload = {
      ciphertext: bufferToBase64(encrypted),
      salt: bufferToBase64(salt),
      iv: bufferToBase64(iv),
      filename: "kyc_upload.zip",
      passphrase,
    };

    try {
      const result = await uploadEncryptedKYC(payload);
      setPreview(result.preview);
      setStatus("✅ Uploaded and processed successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error: " + err.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">KYC Dashboard</h1>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Front Side:</label>
        <input type="file" accept="image/*" onChange={handleFrontFile} />
        {frontFile && (
          <img
            src={URL.createObjectURL(frontFile)}
            alt="front-preview"
            className="w-32 h-32 object-cover rounded shadow mt-2"
          />
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Back Side:</label>
        <input type="file" accept="image/*" onChange={handleBackFile} />
        {backFile && (
          <img
            src={URL.createObjectURL(backFile)}
            alt="back-preview"
            className="w-32 h-32 object-cover rounded shadow mt-2"
          />
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
      >
        Submit KYC
      </button>

      <p className="mt-4 text-gray-700">{status}</p>

      {preview && (
        <div className="mt-6 bg-gray-50 p-4 rounded-xl">
          <h2 className="font-semibold mb-2">Server Response:</h2>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-80">
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
