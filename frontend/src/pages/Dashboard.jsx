import React, { useState } from "react";
import JSZip from "jszip";
import FileUploader from "../components/Kyc/FileUploader";
import { uploadEncryptedKYC } from "../services/operations/kycApi.js";

const Dashboard = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState("");
    const [preview, setPreview] = useState(null);

    const handleFiles = (selectedFiles) => setFiles(selectedFiles);

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
        const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, dataBuffer);
        return new Uint8Array(encrypted);
    }

    function bufferToBase64(buf) {
        let binary = "";
        const chunkSize = 0x8000; // 32KB chunks
        for (let i = 0; i < buf.length; i += chunkSize) {
            const chunk = buf.subarray(i, i + chunkSize);
            binary += String.fromCharCode.apply(null, chunk);
        }
        return btoa(binary);
    }

    // =====================================================

    const handleSubmit = async () => {
        if (!files.length) return alert("Please select files first!");
        const passphrase = prompt("Enter passphrase for encryption:");
        if (!passphrase) return;

        setStatus("Preparing ZIP and encrypting...");

        // Create ZIP
        const zip = new JSZip();
        for (const file of files) {
            const data = await file.arrayBuffer();
            zip.file(file.name, data);
        }
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
            passphrase, // ⚠️ In production, derive passphrase on server or tokenise
        };

        try {
            console.log("payload -> ",payload)
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

            <FileUploader onFilesSelected={handleFiles} />

            {files.length > 0 && (
                <div className="mt-4 text-sm text-gray-600">
                    Selected files: {files.map(f => f.name).join(", ")}
                </div>
            )}

            <button
                onClick={handleSubmit}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
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
