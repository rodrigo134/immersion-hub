# Immersion Hub

Immersion Hub is a language-learning web application focused on daily immersion.
It combines curated study sources, flashcards, and active listening tools in one place.

## What The App Does

- Lets users create an account and sign in with JWT authentication.
- Organizes learning resources by language and category (listening, reading, comprehension, extensions).
- Allows users to create and review flashcards with deck organization.
- Includes a transcription workflow to practice listening and comprehension.
- Supports password recovery via e-mail.

## Who It Is For

- Learners who want one hub for input + review.
- People studying with native content (YouTube, radio, articles, podcasts).
- Users who prefer structured categories and repeatable study routines.

## Main Modules

- Authentication: register, login, logout, forgot/reset password.
- Sources: categorized study materials by language.
- Flashcards: create/edit/delete cards and decks, run review sessions.
- Study Screens: tips, inspiration, transcription, and category browsing.

## Repository Structure

- `backend/`: Spring Boot API, security, database migrations, business rules.
- `frontend/`: React app (UI, navigation, auth screens, study flows).

## Tech Stack

- Backend: Java 21, Spring Boot, Spring Security, JWT, Flyway, PostgreSQL
- Frontend: React 19, TypeScript, Vite, Tailwind CSS

## Run Locally

1. Start PostgreSQL (project default port: `5434`).
2. Start backend:

```bash
cd backend
./mvnw spring-boot:run
```

3. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Open:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## Environment

- Backend env: `backend/.env` (database, JWT, SMTP, frontend URL for reset link).
- Frontend env: `frontend/.env` (`VITE_API_BASE_URL` / `VITE_API_URL`).

## Additional Docs

- Frontend details: [frontend/README.md](./frontend/README.md)
- Auth details: [frontend/README_AUTH.md](./frontend/README_AUTH.md)
- Backend env template: [backend/.env.example](./backend/.env.example)

## Production Notes

- Deploy backend and frontend separately.
- Configure CORS and production API URL.
- Configure SMTP in backend for password recovery e-mails.
