# MyNotes - Full-Stack Notes Application

A notes application built with **NestJS** (backend), **React + Vite + TypeScript** (frontend), and **MongoDB**.

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete personal notes
- Paginated note list (newest first by default)
- Responsive and clean UI using Bootstrap
- All notes are private to the authenticated user
- Fully Dockerized setup


## Prerequisites

- Docker and Docker Compose (recommended)
- Or Node.js ≥ 20 (for local development without Docker)

## Running with Docker (Recommended)

### 1. Create the backend environment file

The backend **requires** a `.env` file in the `notes-backend` directory.

**File location:** `notes-backend/.env`

```
PORT=3000
DB_CONN_STRING=mongodb://mongo:27017/notes-app
JWT_SECRET=your_very_strong_and_random_secret_key_here
```

**Important**
- Replace `JWT_SECRET` with a strong, random value (minimum 32 characters).
- Example: `JWT_SECRET=4237bf4aae6f0509dbd562420a812cd4a1b3e8f9g2h7i0j5k9l4m8n3o6p1q`

### 2. Start the application

From the root directory run: 
```
docker compose up --build
```

### 3. Access the app in your browser

Visit `http://localhost:4173` from your browser

## Running locally (without Docker)

### 1. Backend
Navigate to backend directory:

```
cd notes-backend
```

Make the `.env` file (same as above but with local MongoDB instance):
```
PORT=3000
DB_CONN_STRING=mongodb://localhost:27017/notes-app
JWT_SECRET=your_very_strong_and_random_secret_key_here
```
#### Make sure MongoDB is running on your machine!!!

Install dependencies and run:
```
npm install
npm run start:dev
```
### 2. Frontend
Navigate to frontend directory:
```
cd notes-frontend
```

Install dependencies and run:
```
npm install
npm run dev
```
Frontend will be available at http://localhost:5173 (Vite dev server)


## API endpoints: 
- `POST /auth/register` Register a new user
- `POST /auth/login` Login (returns JWT token)
- `GET /notes` List notes (with pagination: ?page=1&size=10&sort=-1)
- `POST /notes` Create a note
- `PUT /notes/:id` Update a note
- `DELETE /notes/:id` Delete a note

All note endpoints are protected and require `Authorization: Bearer <token>` header.