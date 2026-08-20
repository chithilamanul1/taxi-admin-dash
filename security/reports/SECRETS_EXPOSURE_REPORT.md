# SECRETS_EXPOSURE Security Report

## Status: HIGH

## Findings

During the investigation of the codebase, several instances of hardcoded secrets and passwords were found.

### 1. Hardcoded Passwords in Scripts
Several administrative scripts contain hardcoded passwords used for creating or resetting admin accounts.

- `create_admin.js`
  ```javascript
  const password = 'admin-secure-pass-2026';
  ```
- `reset_admin_passwords.js`
  ```javascript
  const NEW_PASSWORD = 'AdminPass123!';
  ```
- `scripts/reset_admin.js`
  ```javascript
  const newPassword = 'Admin@Taxi2026!'; // Temporary secure password
  ```
- `scripts/setup-new-admin.js`
  ```javascript
  const rawPassword = 'admin-secure-pass-2026.';
  ```
- `src/app/api/drivers/[id]/approve/route.js`
  ```javascript
  const tempPassword = 'Driver@2025';
  ```

### 2. Hardcoded Fallback Secrets
Several API routes use hardcoded fallback secrets if the environment variable is not set. This is dangerous because if the environment variable is missing in production, the application will silently fall back to a known, insecure secret.

- `src/app/api/admin/seo-scheduler/route.js`
  ```javascript
  const cronSecret = process.env.SEO_CRON_SECRET || 'airporttaxis-seo-secret';
  ```
- `src/app/api/bookings/[id]/route.js`
  ```javascript
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345';
  ```
- `src/app/api/bookings/route.js`
  ```javascript
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345';
  ```
- `src/app/api/drivers/login/route.js`
  ```javascript
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345';
  ```
- `upload-server/index.js`
  ```javascript
  const AUTH_TOKEN = process.env.UPLOAD_AUTH_TOKEN || 'chithila123@';
  ```

### 3. Hardcoded Tokens in Configuration
- `vercel.json`
  ```json
  "path": "/api/admin/seo-scheduler?token=airporttaxis-seo-secret",
  ```

## What's at risk

- **Hardcoded Passwords**: If an attacker gains read access to the source code (e.g., through a misconfigured Git repository, SSRF, or insider threat), they can extract these passwords and gain unauthorized administrative or driver access to the system.
- **Hardcoded Fallback Secrets**: If the production environment is misconfigured and the environment variables are missing, the application will use the hardcoded fallback secrets. An attacker who knows these fallback secrets (by reading the source code) can forge JWT tokens, bypass authentication, and trigger administrative endpoints (like the SEO scheduler).

## What's already secure

- `.env` and `.env.test` are correctly added to `.gitignore`.
- `git ls-files .env` returns nothing, confirming that the `.env` file is not tracked by Git.
- `.env.example` contains only placeholder values (e.g., `YOUR_GOOGLE_CLIENT_SECRET`, `change_me`).
- No frontend environment variables (`NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`) were found to contain sensitive secrets.

## Recommendations

1. **Remove Hardcoded Passwords**: Replace hardcoded passwords in scripts with environment variables (e.g., `process.env.DEFAULT_ADMIN_PASSWORD`) or prompt the user for input during script execution.
2. **Remove Fallback Secrets**: Remove all hardcoded fallback secrets. If a required environment variable is missing, the application should throw an error and fail to start or process the request, rather than falling back to an insecure default.
3. **Update Configuration Files**: Remove hardcoded tokens from `vercel.json` and use environment variables or secure configuration management.

## Verification

All recommended fixes have been implemented and verified:
- Hardcoded passwords in scripts were replaced with `process.env.DEFAULT_ADMIN_PASSWORD` and `process.env.DEFAULT_DRIVER_PASSWORD`.
- Hardcoded fallback secrets in API routes were removed, and the routes now throw an error if the required environment variables are missing.
- The hardcoded token in `vercel.json` was removed, and the SEO scheduler route was updated to use the standard `Authorization: Bearer <CRON_SECRET>` header provided by Vercel.
- A final `git grep` confirmed that no hardcoded secrets remain in the codebase.

**Status updated to: PASS**
