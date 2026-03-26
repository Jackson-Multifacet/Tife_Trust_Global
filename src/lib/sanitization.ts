/**
 * Input sanitization utilities to prevent XSS attacks
 */

/**
 * Sanitize text input to remove potentially malicious characters
 */
export function sanitizeText(input: string): string {
  if (!input) return "";

  return input
    .replace(/[<>"/]/g, "") // Remove HTML special characters
    .trim();
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(input: string): string {
  if (!input) return "";

  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._%+-@]/g, "");
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(input: string): string {
  if (!input) return "";

  return input.trim().replace(/[^0-9+\-\s()]/g, "");
}

/**
 * Sanitize alphanumeric input (NIN, BVN, etc)
 */
export function sanitizeAlphanumeric(input: string): string {
  if (!input) return "";

  return input.trim().replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * Validate and sanitize numeric input
 */
export function sanitizeNumeric(input: string): string {
  if (!input) return "";

  return input.trim().replace(/[^0-9.]/g, "");
}

/**
 * Validate file type based on MIME type and extension
 */
export function validateFileType(
  file: File,
  allowedTypes: string[] = ["image/jpeg", "image/png", "application/pdf"],
): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: "Please select a file" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (Nigerian format)
 */
export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+234|0)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validate NIN format (should be 11 digits)
 */
export function validateNIN(nin: string): boolean {
  return /^\d{11}$/.test(nin);
}

/**
 * Validate BVN format (should be 11 digits)
 */
export function validateBVN(bvn: string): boolean {
  return /^\d{11}$/.test(bvn);
}

/**
 * Escape HTML special characters for safe display
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
