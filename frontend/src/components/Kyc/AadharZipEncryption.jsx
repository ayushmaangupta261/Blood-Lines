
import React, { useState } from "react";
import JSZip from "jszip";
import { encode, decode } from "base64-arraybuffer";

function bufToBase64(buf) { return encode(buf); }
function base64ToBuf(b64) { return decode(b64); }
function strToUint8(str) { return new TextEncoder().encode(str); }

async function deriveKeyFromPassphrase(passphrase, salt, iterations = 250000) {
  // passphrase: string, salt: Uint8Array
  const passKey = await window.crypto.subtle.importKey(
    "raw",
    strToUint8(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    passKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  return key;
}

export default function AadhaarZipEncrypt() {
  const [frontFile, setFrontFile] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [pass, setPass] = useState("");
  const [status, setStatus] = useState("");

  async function createZipAndEncrypt() {
    if (!frontFile || !backFile || !pass) return alert("Provide files and a passphrase");

    setStatus("Creating ZIP...");
    const zip = new JSZip();
    zip.file(frontFile.name || "front.jpg", await frontFile.arrayBuffer());
    zip.file(backFile.name || "back.jpg", await backFile.arrayBuffer());

    const zipContent = await zip.generateAsync({ type: "arraybuffer" });

    setStatus("Deriving key & encrypting...");

    // generate salt and iv
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // 16 bytes
    const iv = window.crypto.getRandomValues(new Uint8Array(12));   // 12 bytes for AES-GCM

    const key = await deriveKeyFromPassphrase(pass, salt);

    // encrypt (AES-GCM). WebCrypto returns ArrayBuffer where auth tag is appended.
    const cipherBuf = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      zipContent
    );

    // send base64-encoded
    const payload = {
      filename: "offline-eKYC.zip",
      ciphertext: bufToBase64(cipherBuf),
      salt: bufToBase64(salt.buffer),
      iv: bufToBase64(iv.buffer),
      originalFileNames: [frontFile.name, backFile.name],
    };

    setStatus("Uploading encrypted payload to server...");

    // POST JSON to server
    const resp = await fetch("/api/kyc/upload-encrypted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, passphrase: pass }) // passphrase must be sent so backend can decrypt
    });

    const j = await resp.json();
    if (resp.ok) {
      setStatus("Success: " + (j.message || "uploaded and processed"));
    } else {
      setStatus("Error: " + (j.error || JSON.stringify(j)));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Aadhaar: create & encrypt ZIP on frontend</h2>
      <div>
        <label>Front image (photo side): <input type="file" accept="image/*" onChange={e=>setFrontFile(e.target.files[0])} /></label>
      </div>
      <div>
        <label>Back image (address side): <input type="file" accept="image/*" onChange={e=>setBackFile(e.target.files[0])} /></label>
      </div>
      <div>
        <label>Share code / passphrase: <input type="password" value={pass} onChange={e=>setPass(e.target.value)} /></label>
      </div>
      <div>
        <button onClick={createZipAndEncrypt}>Create ZIP, Encrypt & Upload</button>
      </div>
      <div style={{ marginTop: 12 }}>{status}</div>
    </div>
  );
}
