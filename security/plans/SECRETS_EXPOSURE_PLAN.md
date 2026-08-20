# SECRETS_EXPOSURE Fix Plan

## Changes

- `create_admin.js` — Replace hardcoded `password` with `process.env.DEFAULT_ADMIN_PASSWORD`. Throw an error if not set.
- `reset_admin_passwords.js` — Replace hardcoded `NEW_PASSWORD` with `process.env.DEFAULT_ADMIN_PASSWORD`. Throw an error if not set.
- `scripts/reset_admin.js` — Replace hardcoded `newPassword` with `process.env.DEFAULT_ADMIN_PASSWORD`. Throw an error if not set.
- `scripts/setup-new-admin.js` — Replace hardcoded `rawPassword` with `process.env.DEFAULT_ADMIN_PASSWORD`. Throw an error if not set.
- `src/app/api/drivers/[id]/approve/route.js` — Replace hardcoded `tempPassword` with a randomly generated password or `process.env.DEFAULT_DRIVER_PASSWORD`.
- `src/app/api/admin/seo-scheduler/route.js` — Remove fallback `'airporttaxis-seo-secret'`. Throw an error if `process.env.SEO_CRON_SECRET` is not set.
- `src/app/api/bookings/[id]/route.js` — Remove fallback `'seranex_secret_key_12345'`. Throw an error if `process.env.JWT_SECRET` and `process.env.NEXTAUTH_SECRET` are not set.
- `src/app/api/bookings/route.js` — Remove fallback `'seranex_secret_key_12345'`. Throw an error if `process.env.JWT_SECRET` and `process.env.NEXTAUTH_SECRET` are not set.
- `src/app/api/drivers/login/route.js` — Remove fallback `'seranex_secret_key_12345'`. Throw an error if `process.env.JWT_SECRET` and `process.env.NEXTAUTH_SECRET` are not set.
- `upload-server/index.js` — Remove fallback `'chithila123@'`. Throw an error if `process.env.UPLOAD_AUTH_TOKEN` is not set.
- `vercel.json` — Remove the hardcoded token from the cron job path. It should ideally be configured via Vercel's environment variables, but since `vercel.json` doesn't support env var interpolation in `crons.path`, we might need to use a secure, non-guessable path or rely on a different mechanism. For now, we will document this limitation and recommend using a secure, randomly generated string in `vercel.json` and matching it in the environment variable.

## New files

None.

## Verification goals

After implementation, ALL of these must be true:

- [ ] `git ls-files .env` returns nothing
- [ ] `grep -rn` for secret patterns across all source files returns nothing (except for placeholders in `.env.example` and documentation).
- [ ] No env var prefixed with `NEXT_PUBLIC_`, `VITE_`, or `REACT_APP_` contains a secret key.
- [ ] `.env.example` exists with placeholder values only.
- [ ] API routes throw an error if required secret environment variables are missing.

## Manual verification (for the human)

- Verify that the cron job in `vercel.json` is configured securely and matches the `SEO_CRON_SECRET` in the production environment.
- Ensure that `DEFAULT_ADMIN_PASSWORD` and `DEFAULT_DRIVER_PASSWORD` are set in the `.env` file before running any administrative scripts.
