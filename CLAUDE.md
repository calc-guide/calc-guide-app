# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`calc-guide-app` — a monorepo math tutor that interactively teaches calculus in the style of popular math influencers. React (Vite) frontend + Spring Boot backend, packaged as a **single Docker image** and deployed as one Render web service. No database, no auth (hackathon project).

## Commands

### Backend (`backend/`, Java 21, Spring Boot 3.3.4, Maven)
- Run locally: `mvn spring-boot:run` (serves on `:8080`)
- Build jar: `mvn clean package` → `target/calc-guide-server-0.0.1-SNAPSHOT.jar`
- All tests: `mvn test`
- Single test: `mvn test -Dtest=ClassName#methodName`

### Frontend (`frontend/`, React 18, Vite 5)
- Install: `npm install`
- Dev server: `npm run dev`
- Production build: `npm run build` → `dist/`

### Full image (local)
- `docker compose up --build` → single `app` service on `:8080`, serving both the React app and the API.

## Architecture

One deployable unit: Spring Boot serves the API **and** the built React app, same-origin (no CORS).

- **Backend** (`com.calcguide`): Spring Boot Web. `HealthController` → `/api/health`. `SpaController` implements `ErrorController`: HTML 404s forward to `/index.html` (client-side routing), non-HTML errors return JSON. No DB, no security config. The Anthropic/LLM integration and its API-key env var are not yet built.
- **Frontend**: single-page React app (`src/App.jsx` via `src/main.jsx`), calls the backend with relative `/api/...` paths.

### Build / deploy topology (the non-obvious part)
- Root **`Dockerfile`** (build context = repo root) runs the Maven build and copies `frontend/dist` into `src/main/resources/static`, so the jar serves the UI. JRE runtime stage runs the jar on `:8080`.
- Deployed as **one Render Docker web service**, root directory `/`. Serves app + API together. Live: `https://calc-guide-app.onrender.com`
- `docker-compose.yml` is local-dev only — Render builds the Dockerfile directly.

> **Stale-UI trap:** `frontend/dist/` is committed to the repo, and the Docker build copies that *committed* `dist` — it does **not** run `npm run build`. After any frontend change you must `npm run build` AND commit the updated `frontend/dist`, or the deploy ships stale UI with no error.

> **Dev gotcha:** `vite.config.js` has no dev proxy, so `/api` calls won't reach the backend under `npm run dev`. Use `mvn spring-boot:run` (or docker compose) for an end-to-end stack, or add a Vite proxy.

## Deploy / ops notes
- Free-tier instance **sleeps after ~15 min idle** (~50s cold start). Warm `…/api/health` before demos.
- API key: set in the Render service's Environment (never in code); triggers a redeploy. Var name TBD by backend.
- 512 MB instance is tight for the JVM — if it OOMs, add a heap cap (e.g. `-XX:MaxRAMPercentage=70`) to the `Dockerfile` (not currently set).

## Orientation

### Entry points
- `backend/src/main/java/com/calcguide/CalcGuideApplication.java` — Spring Boot bootstrap
- `backend/src/main/java/com/calcguide/controller/HealthController.java` — REST pattern (`/api/*`)
- `backend/src/main/java/com/calcguide/controller/SpaController.java` — SPA fallback + API error JSON
- `frontend/src/main.jsx` → `frontend/src/App.jsx` — React mount and the single-page UI
- `Dockerfile` — single-image build that bakes the UI into the jar
