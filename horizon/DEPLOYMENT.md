# Horizon Connect · deployment and architecture

The BROOTHERHOOD public experience at `/horizon/` is a static web app. Multiuser registrations, signed QR passes, live voting, polls, records, admin tools and Gemini responses require the **FastAPI backend** located in `horizon/backend/`.

**Deployment status:** the public GitHub Pages site publishes the dashboard and explicitly labeled demo information. A production API is **not** assumed to exist. The backend requires separately configured hosting and persistent database storage.

## Services

- Frontend: HTML5/CSS3/JavaScript, deployed via GitHub Pages.
- Backend: Python FastAPI, JWT sessions, Argon2 password hashing, Pydantic validation, SQLAlchemy.
- Database: MySQL 8+ using `mysql+pymysql://` in production; SQLite is used for local testing.
- AI: Gemini through `google-genai` on the server if `GEMINI_API_KEY` is configured, with a clearly labeled non-AI FAQ fallback.
- QR: JWT-signed registrations delivered as SVG QR images, organizer-only check-in, database atomic duplicate prevention.
- Certificates: ReportLab PDF, verification UUID/QR, issued only after verified attendance.
- Polls, expos, leaderboards and gamification: stored server-side; uniqueness constraints block duplicate registered-user votes. Leaderboards anonymize public display names.
- Roles: visitors, students, lecturers, organizers, and administrators. New users can self-register only as visitors or students; a trusted admin assigns elevated roles.

## Production environment

The backend reads the following **server-side environment variables**, never public client-side keys:

```env
APP_ENV=production
APP_SECRET=<unique-secret-at-least-32-characters>
DATABASE_URL=mysql+pymysql://<user>:<password>@<mysql-host>:3306/<database>
CORS_ORIGINS=https://royalpuskar.github.io
PUBLIC_URL=https://<your-backend-domain>
SEED_DEMO=0
GEMINI_API_KEY=<your-server-held-key>
GEMINI_MODEL=gemini-2.5-flash
TOKEN_TTL_MINUTES=480
BOOTSTRAP_ADMIN_EMAIL=<trusted-organizer-email>
BOOTSTRAP_ADMIN_PASSWORD=<strong-unique-password-12-plus-characters>
```

For local development, use `uvicorn app:app --host 127.0.0.1 --port 8000` inside `horizon/backend/` after installing `requirements.txt`. The default SQLite database is local-only. The `/api/docs` endpoint provides OpenAPI documentation for the backend.

A database migration strategy (Alembic), managed secrets, distributed Redis rate limiting, backup/restore, TLS termination, production monitoring and a formal privacy review are recommended before an official live university event. The included rate limiter is single-process only. The current attendance QR token remains valid until expiry, but reuse to create a second check-in is blocked in the database.

Connect the live frontend using the **Backend** button and the public HTTPS URL of your deployed service. User passwords, API tokens and Gemini credentials must never be put in GitHub Pages JavaScript.

## University authority and data

The project is an independent Horizon 2026 competition concept, not an official university event registration system. It does not include university trademarks or unlicensed logo images. All schedules, room locations, exhibitors and communities seeded by `SEED_DEMO=1` carry prominent DEMO labels. Dates and room assignments are fictional until an authorized organizer supplies official details.

The campus link points to the institution's broadly known Gading Serpong location. Precise room maps and building routing require authorized location data and should not be guessed.

## Operational acceptance checks

The repository runs a backend integration suite that covers signup/login, privilege restrictions, single-use attendance check-in, authenticated QR retrieval, unique expo and poll votes, real leaderboard scoring, certificate generation/verification, organizer announcements and admin reports.

**Important distinction:** API tests verify functionality in a local controlled database. They do not prove a production hosting deployment, real-world organizer authorization, or a successful Gemini API call with production credentials.
