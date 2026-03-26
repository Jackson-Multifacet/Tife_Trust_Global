import { storage } from "@/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { validateFileType } from "@/lib/sanitization";

/**
 * Upload a file to Firebase Storage with validation
 * @param file - File to upload
 * @param path - Storage path (e.g., "applications/{applicationId}/documents")
 * @param allowedTypes - Allowed MIME types
 * @returns Promise with download URL
 */
export async function uploadFile(
  file: File,
  path: string,
  allowedTypes: string[] = ["image/jpeg", "image/png", "application/pdf"],
): Promise<string> {
  // Validate file
  const validation = validateFileType(file, allowedTypes);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid file");
  }

  // Create safe filename
  const safeFileName = `${Date.now()}_${sanitizeFileName(file.name)}`;
  const storageRef = ref(storage, `${path}/${safeFileName}`);

  try {
    // Upload file
    await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        originalName: file.name,
        fileSize: file.size.toString(),
      },
    });

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file. Please try again.");
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const storageRef = ref(storage, fileUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("File deletion error:", error);
    throw new Error("Failed to delete file");
  }
}

/**
 * Upload multiple files in parallel
 */
export async function uploadMultipleFiles(
  files: { file: File; path: string }[],
): Promise<string[]> {
  try {
    const uploadPromises = files.map(({ file, path }) =>
      uploadFile(file, path),
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Batch upload error:", error);
    throw new Error("Failed to upload some files");
  }
}

/**
 * Sanitize filename to prevent directory traversal and special characters
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, "_") // Replace special chars with underscore
    .replace(/_{2,}/g, "_") // Replace multiple underscores with single
    .substring(0, 200); // Limit length
}

/**
 * Get file extension
 */
export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop() || "";
}

/**
 * Get human-readable file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
