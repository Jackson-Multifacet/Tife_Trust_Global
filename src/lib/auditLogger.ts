import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebase";

/**
 * Logs administrative and security-relevant actions to the auditLogs collection.
 * This ensures accountability and helps in security investigations.
 */
export const logAction = async (
  action: string,
  collectionName: string,
  documentId: string,
  changes?: any,
) => {
  try {
    // Basic IP fetching. In production, this is more reliably handled via Cloud Functions.
    let ipAddress = "unknown";
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      ipAddress = data.ip;
    } catch (e) {
      console.warn("Audit Logger: Could not fetch IP address for logging", e);
    }

    const logEntry = {
      userId: auth.currentUser?.uid || "unauthenticated",
      userEmail: auth.currentUser?.email || "unknown",
      action,
      collection: collectionName,
      documentId,
      changes: changes || {},
      timestamp: serverTimestamp(),
      ipAddress,
      userAgent: navigator.userAgent,
    };

    await addDoc(collection(db, "auditLogs"), logEntry);
    return true;
  } catch (error) {
    console.error("Audit logging failed:", error);
    return false;
  }
};
