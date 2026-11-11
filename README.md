# AcePrep API

Express + MongoDB backend for [AcePrep](https://github.com/binary-amigo/Aceprep).

## Run locally

```bash
cp .env.example .env    # fill in MONGODB_URI and JWT_SECRET
npm install
npm run dev             # http://localhost:3000
npm test
```

## Endpoints

| Method | Path | Body / auth | Returns |
|---|---|---|---|
| POST | `/api/signup` | `{ firstName, lastName, email, phone?, password }` | `201 { token, user }` |
| POST | `/api/login` | `{ email, password }` | `{ token, user }` |
| POST | `/api/login/google` | `{ credential }` (Google ID token) | `{ token, user }` |
| GET | `/api/me` | `Authorization: Bearer <token>` | `{ user }` |
| GET | `/api/mockInterview?role=` | | interview questions |
| GET | `/api/resources` | | resources |
| GET | `/api/health` | | `{ status: "ok" }` |

How it works:

- **Errors:** every error is JSON shaped like `{ message }`.
- **Rate limit:** auth routes allow 10 requests per minute per IP.
- **Tokens:** HS256 JWTs signed with `JWT_SECRET`, valid for 7 days by default.
- **Google sign-in:** the backend checks each Google sign-in with Google and confirms it was issued for `GOOGLE_CLIENT_ID`.

## Deploy (Vercel)

`src/index.js` exports the Express app, which Vercel serves as a function. Set these environment variables in the Vercel project: `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID` and `CORS_ORIGINS`.

In MongoDB Atlas → Network Access, allow connections from Vercel. Vercel has no fixed IPs on the standard plans, so that means `0.0.0.0/0`, protected by a strong database password.

## Secrets

Never commit `.env`. Earlier commits contained real credentials, so treat those as leaked: rotate the MongoDB password and the API key.
