# CampusCompass — Backend API

AI-powered college & career guidance platform. Built with Node.js, Express, MongoDB, and Groq AI.

---

## Tech Stack
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **AI:** Groq API (`openai/gpt-oss-120b`)
- **File Uploads:** AWS S3 (presigned URLs)

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in all values in .env

# 3. Seed the database (25 Indian colleges)
npm run seed

# 4. Start dev server
npm run dev
# → http://localhost:5000
```

---

## Environment Variables (`.env`)

| Variable | Where to get it |
|----------|----------------|
| `MONGO_URI` | [mongodb.com/atlas](https://mongodb.com/atlas) |
| `JWT_SECRET` | `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `GROQ_API_KEY` | [console.groq.com/keys](https://console.groq.com/keys) |
| `AWS_ACCESS_KEY_ID` | AWS IAM Console |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM Console |
| `AWS_REGION` | e.g. `ap-south-1` |
| `AWS_BUCKET_NAME` | Your S3 bucket name |
| `PORT` | Default: `5000` |

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Register -> returns JWT |
| POST | `/api/auth/login` | No | Login -> returns JWT |
| POST | `/api/profile` | Yes | Create / update student profile |
| GET | `/api/profile` | Yes | Get own profile |
| PATCH | `/api/profile/file` | Yes | Save S3 file key after upload |
| GET | `/api/colleges` | No | List colleges — filter: `?stream=&location=&maxBudget=` |
| POST | `/api/bookmarks` | Yes | Bookmark a college |
| GET | `/api/bookmarks` | Yes | Get bookmarked colleges (populated) |
| DELETE | `/api/bookmarks/:id` | Yes | Remove a bookmark |
| POST | `/api/ai/ask` | Yes | AI counselor — `{ question }` -> `{ answer }` |
| POST | `/api/upload/presign` | Yes | Get S3 presigned URL — `{ filename, filetype }` |

> Protected routes require `Authorization: Bearer <token>` header.

---

## File Upload Flow

```
1. POST /api/upload/presign  → { uploadUrl, fileKey }
2. PUT  {uploadUrl}          → upload file directly to S3
3. PATCH /api/profile/file   → { fileKey, type: "photo" | "document" }
```

---

## Folder Structure

```
backend/
├── models/       User, StudentProfile, College, Bookmark
├── routes/       auth, profile, colleges, bookmarks, ai, upload
├── middleware/   auth.js (JWT verifier)
├── seed.js       DB seeder
├── seedData.json 25 Indian colleges
└── server.js     Entry point
```
