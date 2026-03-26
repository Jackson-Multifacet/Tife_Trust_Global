# Security Implementation Guide

## Overview

This document outlines the security improvements implemented in Tife Trust Global and provides guidance for developers on maintaining and extending them.

---

## 1. Authentication & Authorization ✅ IMPLEMENTED

### Protected Routes

- **File:** `src/components/ProtectedRoute.tsx`
- **What it does:** Wraps sensitive routes and verifies user authentication status and role
- **Usage:**

```tsx
<Route
  path="/portal/admin"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminLayout />
    </ProtectedRoute>
  }
/>
```

### Auth Persistence

- **File:** `src/hooks/useAuthPersistence.ts`
- **What it does:** Maintains authentication state across page reloads
- **How to use:** Call `useAuthPersistence()` in your root component (already done in App.tsx)

### Proper Logout

- **File:** `src/components/layout/DashboardLayout.tsx` (line 20-27)
- **What it does:** Calls Firebase's `signOut()` to properly clear authentication
- **Status:** ✅ Implemented

---

## 2. Secure Configuration Management ✅ IMPLEMENTED

### Environment Variables

**IMPORTANT:** Firebase credentials are now loaded from environment variables, NOT hardcoded!

**Required environment variables:**

```env
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_FIRESTORE_DB_ID=
```

**Files affected:**

- `.env.local` - Local development (add to .gitignore ✅)
- `src/firebase.ts` - Loads configuration with validation

**Note:** `firebase-applet-config.json` is no longer used and can be safely deleted from git.

---

## 3. File Upload Security ✅ IMPLEMENTED

### Secure File Upload Utility

**File:** `src/lib/fileUpload.ts`

**Features:**

- Validates file type (whitelist: image/jpeg, image/png, application/pdf)
- Enforces file size limit (5MB max)
- Sanitizes filenames to prevent directory traversal
- Uploads to Firebase Storage with metadata
- Returns secure download URLs

**Usage:**

```tsx
import { uploadFile } from "@/lib/fileUpload";

const downloadURL = await uploadFile(file, "applications/2024/");
```

**Status:** ✅ Implemented in CandidateForm

---

## 4. Input Sanitization & Validation ✅ IMPLEMENTED

### Sanitization Library

**File:** `src/lib/sanitization.ts`

**Available functions:**

- `sanitizeText()` - Removes HTML special characters
- `sanitizeEmail()` - Normalizes email input
- `sanitizePhone()` - Keeps valid phone format
- `sanitizeAlphanumeric()` - Keeps only letters and numbers
- `sanitizeNumeric()` - Keeps only numbers and decimal points
- `validateEmail()` - Validates email format
- `validateNIN()` - Validates 11-digit NIN
- `validateBVN()` - Validates 11-digit BVN
- `validatePhone()` - Validates Nigerian phone numbers
- `validateFileType()` - Validates file type and size
- `escapeHtml()` - Escapes HTML special characters

**Usage:**

```tsx
import { sanitizeEmail, validateNIN } from "@/lib/sanitization";

const email = sanitizeEmail(userInput);
if (!validateNIN(ninInput)) {
  setError("Invalid NIN format");
}
```

**Status:** ✅ Implemented in CandidateForm

---

## 5. Error Handling & Error Boundary ✅ IMPLEMENTED

### Error Boundary Component

**File:** `src/components/ErrorBoundary.tsx`

**What it does:**

- Catches React errors to prevent white-screen crashes
- Shows user-friendly error message
- Logs errors for debugging
- Provides recovery options

**Usage:**

```tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

**Status:** ✅ Implemented in App.tsx (wraps entire app)

**Development mode:** Shows error details in red box for debugging

---

## 6. Firestore Security Rules ✅ IMPLEMENTED

### Enhanced Security Rules

**File:** `firestore.rules`

**Key improvements:**

- Removed hardcoded email from admin check
- Added role-based access control via custom claims
- Implemented data-level security (users can only read/update their own data)
- Added audit log collection (append-only)
- Added application note collection
- Implemented timestamps validation

**Critical rules:**

```plaintext
// Audit logs cannot be modified or deleted
match /auditLogs/{logId} {
  allow create: if isAuthenticated()
  allow read: if isAdmin()
  allow update, delete: if false  // Never allow
}

// Applications - data-level security
match /applications/{applicationId} {
  allow read: if isStaff() && (
    resource.data.submittedByEmail == request.auth.token.email ||
    resource.data.staffAssignedUid == request.auth.uid ||
    isAdmin()
  )
}
```

**To deploy rules:**

```bash
firebase deploy --only firestore:rules
```

**Status:** ✅ Implemented

---

## 7. Testing Framework ✅ SETUP

### Testing Tools Installed

- **Vitest** - Fast unit testing
- **Testing Library** - React component testing
- **jsdom** - DOM simulation

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Visual test interface
```

### Test Files Location

```
src/__tests__/
  ├── setup.ts
  ├── lib/
  │   └── sanitization.test.ts
  └── components/
      └── ErrorBoundary.test.tsx
```

### Writing New Tests

Example test:

```tsx
import { describe, it, expect } from "vitest";
import { sanitizeText } from "@/lib/sanitization";

describe("sanitizeText", () => {
  it("should remove HTML tags", () => {
    expect(sanitizeText('<script>alert("xss")</script>')).toBe(
      "scriptalertxssscript",
    );
  });
});
```

**Status:** ✅ Framework setup complete, basic tests created

---

## 8. Staff Account Management 🟡 PARTIALLY IMPLEMENTED

### What was changed:

- Staff signup now requires admin approval
- New accounts are created with `status: "inactive"`
- Password validation (min 8 characters)
- Email validation
- Better error messages

### What still needs:

- Admin dashboard to approve/reject staff
- Email notification to admin on signup
- Email verification before account activation

**File to update:** `src/pages/portal/StaffManagement.tsx`

---

## Still TODO 🔴

### Week 2 - High Priority

#### 1. Admin Approval Workflow

```tsx
// In StaffManagement.tsx - Add approve/reject buttons
const approveStaff = async (userId: string) => {
  await updateDoc(doc(db, "users", userId), {
    status: "active",
  });
};
```

#### 2. Email Notifications

- Install: `npm install firebase-admin nodemailer`
- Create Cloud Function to send emails
- Email on: signup, approval, application status change

#### 3. Rate Limiting

- Implement rate limiting on public form
- Add CAPTCHA (already installed react-google-recaptcha-v3)
- Limit submissions per IP address

#### 4. Audit Logging

```tsx
// Helper function to log actions
async function logAction(
  action: string,
  collection: string,
  docId: string,
  changes: any,
) {
  await addDoc(collection(db, "auditLogs"), {
    userId: auth.currentUser?.uid,
    action,
    collection,
    documentId: docId,
    changes,
    timestamp: serverTimestamp(),
    ipAddress: getClientIp(), // Need to implement
  });
}
```

### Week 3 - Quality

#### 1. Increase Test Coverage

- Add tests for PortalLogin component
- Add tests for CandidateForm validation
- Add integration tests for Firestore operations

#### 2. Error Tracking (Sentry)

```bash
npm install @sentry/react @sentry/tracing
```

#### 3. Input Validation in All Forms

- Apply sanitization to all form fields
- Add real-time validation feedback

---

## Security Checklist

### Before Production

- [ ] Rotate all Firebase keys (credentials were exposed)
- [ ] Enable Firebase Authentication - Enable Firestore security rules
- [ ] Set up Firebase Storage security rules (currently open!)
- [ ] Enable reCAPTCHA v3 on public form
- [ ] Set up email notifications
- [ ] Implement rate limiting
- [ ] Enable HTTPS only
- [ ] Set up monitoring/alerting
- [ ] Conduct security audit
- [ ] Set up automated backups
- [ ] Document security policies

### Ongoing

- [ ] Review Firestore rules quarterly
- [ ] Monitor Firebase console for suspicious activity
- [ ] Review audit logs regularly
- [ ] Update dependencies monthly
- [ ] Conduct penetration testing annually

---

## Useful Commands

```bash
# Run tests
npm test
npm run test:watch

# Type check
npm run type-check

# Development
npm run dev

# Build
npm build

# Firestore rules deployment
firebase deploy --only firestore:rules

# View logs
firebase functions:log

# Emulate locally
firebase emulators:start
```

---

## References

- [Firebase Security Best Practices](https://firebase.google.com/docs/firestore/security/best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)
- [Testing Library Docs](https://testing-library.com/)

---

Last Updated: March 26, 2026
