# 🛡️ Security & UI Fixes v1.2.20

**Date**: January 29, 2026
**Version**: 1.2.20
**Status**: Applied & Ready for Testing

---

## 🚨 Critical Security Fixes (Audit Compliance)

We have addressed the 4 critical/high issues identified in the comprehensive audit.

### 1. Privacy: Anonymized User Data
- **Issue**: `CLIENT_ID` was being generated and sent with every sync, allowing potential fingerprinting.
- **Fix**: Removed `CLIENT_ID` entirely from `firebase.ts`. Sync now relies solely on the authenticated user ID (which is protected by RLS) or anonymous session IDs that don't persist across installs.

### 2. Security: Hashed Email Storage
- **Issue**: User emails were being used as keys in Firestore paths (e.g., `users/john.doe@gmail.com/...`), making them potentially visible to admins or via query patterns.
- **Fix**: Implemented `hashEmail()` using SHA-256.
  - Emails are now hashed before being used as database keys.
  - **Backward Compatibility**: The system checks both the new hash key AND the old sanitized email key to ensure existing Pro users don't lose access.

### 3. Privacy: Telemetry Consent
- **Issue**: Telemetry data was being collected without explicit user consent.
- **Fix**:
  - Added `telemetryConsent` flag in `chrome.storage.local`.
  - Updated `TelemetryService` to strictly check this flag before queuing or sending any data.
  - Added a **Toggle Switch** in the Settings UI to allow users to opt-in/out.
  - Default state is `false` (Opt-in) for maximum privacy compliance.

### 4. Reliability: Error Handling
- **Issue**: Firebase service was returning empty arrays `[]` on error, masking failures.
- **Fix**: Added explicit error logging in `firebase.ts`. While we still return empty arrays to prevent UI crashes, we now log specific error codes to the console to aid debugging.

---

## 🎨 UI/UX Improvements

### 1. Uniform Button Styling
- **Issue**: "Extract" and "Summarize" buttons had inconsistent padding and heights across different platforms (Lovable, ChatGPT, etc.) due to inheriting host site styles.
- **Fix**: Enforced strict CSS overrides in `content/index.ts`:
  - Fixed height: `28px`
  - Fixed padding: `0 12px`
  - Fixed font: System sans-serif (Apple/Windows standard)
  - Removed platform-specific interference using `!important` on key properties.

### 2. Settings UI Update
- Added "Analytics" toggle to the Settings popup.
- Implemented custom CSS toggle switch for a polished look.

---

## 🧪 Testing Instructions

### Verify Security
1. **Sync**: Log in and perform an extraction. Check Network tab/Console to ensure no `clientId` is being sent in the payload.
2. **Privacy**: Check Firestore (if you have access) or Console logs to verify user keys are now SHA-256 hashes, not raw emails.

### Verify Telemetry
1. Go to **Settings**.
2. Toggle "Analytics" **OFF**.
3. Perform an action. Verify no network requests to `telemetry` collection.
4. Toggle "Analytics" **ON**.
5. Perform an action. Verify telemetry request is sent.

### Verify UI Uniformity
1. Open **Lovable** and **ChatGPT**.
2. Compare the "Extract" buttons.
3. They should now be identical in size, padding, and font weight.

---

## 📦 Next Steps
- Build and deploy v1.2.20.
- Verify the "Pulse Check" feature (if enabled).
- Continue with further UI polish if needed.
