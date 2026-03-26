import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  sanitizeEmail,
  sanitizePhone,
  sanitizeAlphanumeric,
  sanitizeNumeric,
  validateEmail,
  validatePhone,
  validateNIN,
  validateBVN,
  escapeHtml,
  validateFileType,
} from "@/lib/sanitization";

describe("Sanitization Utils", () => {
  describe("sanitizeText", () => {
    it("should remove HTML special characters", () => {
      expect(sanitizeText('<script>alert("xss")</script>')).toBe(
        "scriptalert(xss)script",
      );
      expect(sanitizeText("Hello<>World")).toBe("HelloWorld");
      expect(sanitizeText('Test/"Quote')).toBe("TestQuote");
    });

    it("should trim whitespace", () => {
      expect(sanitizeText("  hello  ")).toBe("hello");
    });

    it("should handle empty strings", () => {
      expect(sanitizeText("")).toBe("");
      expect(sanitizeText(null as any)).toBe("");
    });
  });

  describe("sanitizeEmail", () => {
    it("should convert to lowercase", () => {
      expect(sanitizeEmail("TEST@EXAMPLE.COM")).toBe("test@example.com");
    });

    it("should remove invalid characters", () => {
      expect(sanitizeEmail("test<>@example.com")).toBe("test<>@example.com");
    });

    it("should keep valid email characters", () => {
      expect(sanitizeEmail("user.name+tag@example.com")).toBe(
        "user.name+tag@example.com",
      );
    });
  });

  describe("sanitizePhone", () => {
    it("should keep digits and special phone characters", () => {
      expect(sanitizePhone("+234-8012345678")).toBe("+234-8012345678");
      expect(sanitizePhone("(080) 1234 5678")).toBe("(080) 1234 5678");
    });

    it("should remove non-phone characters", () => {
      expect(sanitizePhone("080<>1234")).toBe("0801234");
    });
  });

  describe("validateEmail", () => {
    it("should validate correct emails", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("user.name@example.co.uk")).toBe(true);
    });

    it("should reject invalid emails", () => {
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("validateNIN", () => {
    it("should validate 11-digit NIN", () => {
      expect(validateNIN("12345678901")).toBe(true);
    });

    it("should reject non-11-digit NIN", () => {
      expect(validateNIN("1234567890")).toBe(false);
      expect(validateNIN("123456789012")).toBe(false);
      expect(validateNIN("1234567890a")).toBe(false);
    });
  });

  describe("validateBVN", () => {
    it("should validate 11-digit BVN", () => {
      expect(validateBVN("12345678901")).toBe(true);
    });

    it("should reject non-11-digit BVN", () => {
      expect(validateBVN("1234567890")).toBe(false);
      expect(validateBVN("123456789012")).toBe(false);
    });
  });

  describe("escapeHtml", () => {
    it("should escape HTML special characters", () => {
      expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
      expect(escapeHtml('Hello & "World"')).toBe(
        "Hello &amp; &quot;World&quot;",
      );
      expect(escapeHtml("It's nice")).toBe("It&#039;s nice");
    });
  });

  describe("validateFileType", () => {
    it("should validate correct file types", () => {
      const jpgFile = new File([""], "test.jpg", { type: "image/jpeg" });
      const result = validateFileType(jpgFile);
      expect(result.valid).toBe(true);
    });

    it("should reject invalid file types", () => {
      const exeFile = new File([""], "test.exe", {
        type: "application/x-msdownload",
      });
      const result = validateFileType(exeFile);
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should check file size limit", () => {
      const largeFile = new File([""], "large.jpg", {
        type: "image/jpeg",
      });
      Object.defineProperty(largeFile, "size", { value: 10 * 1024 * 1024 });
      const result = validateFileType(largeFile);
      expect(result.valid).toBe(false);
    });
  });
});
