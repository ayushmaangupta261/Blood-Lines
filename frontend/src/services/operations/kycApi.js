import { apiConnector } from "../apiConnector.js"; // adjust path as needed
import {kycEndpoints} from "../apiEndpoints/kycEndpoints.js"

const { upload_Encrypted_KYC_Url } = kycEndpoints;

export const uploadEncryptedKYC = async (payload) => {
  try {
    const res = await apiConnector(
      "POST",
      upload_Encrypted_KYC_Url,
      payload,
      
    );

    // Axios wraps response in res.data
    return res.data;
  } catch (err) {
    console.error("Error uploading KYC:", err.response || err.message);
    throw new Error(err.response?.data?.error || err.message || "Upload failed");
  }
};
