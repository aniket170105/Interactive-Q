# Interactive-Q

A full-stack, real-time Q&A and polling platform. Users can sign up, create or join rooms, chat, post polls, vote, like messages, and manage members. The stack combines a Spring Boot REST API with MySQL for persistence, a Node.js Socket.IO service for realtime events, and a React (Vite) frontend.

- Backend (Java, Spring Boot 3): REST API, JWT auth, room/message/poll logic
- Realtime (Node.js, Socket.IO): room-based events (messages, votes, likes, room admin actions)
- Frontend (React + Vite + Tailwind): SPA served statically in Docker
- Database (MySQL 8): schema managed by JPA; optional SQL seed hook
- Docker Compose: one command to run the whole stack

## Quick links
- Java API base: http://localhost:8081
- Socket.IO base: http://localhost:3000
- Frontend: http://localhost:5173
- MySQL: localhost:3306 (db: test_temp)
- Swagger UI: http://localhost:8081/swagger-ui/index.html
  - OpenAPI JSON: http://localhost:8081/v3/api-docs

---

## Contents
- What’s inside
- Architecture
- Getting started
  - With Docker Compose
  - Local development (no Docker)
- Configuration
  - Environment variables
  - CORS and WebSockets
- API overview (REST)
- Realtime events (Socket.IO)
- Data model
- Frontend notes
- Useful scripts
- Troubleshooting
- Roadmap and improvements

---

## What’s inside

Repository layout:

- `docker-compose.yml` — Orchestrates MySQL, Spring Boot backend, Node.js realtime service, and frontend image
- `Backend/`
  - `main/` — Spring Boot application
    - `pom.xml` — Dependencies and build config (Spring Boot 3.1.5, Java 17)
    - `src/main/java/com/InteractiveQ/main/` — Source code
      - `MainApplication.java`
      - `auth/`
        - `SecurityConfig.java` — Global CORS config
        - `WebSocketConfig.java` — STOMP endpoint (present; broker currently disabled/commented)
      - `controller/` — REST controllers
        - `AuthController.java` — Signup
        - `TokenController.java` — Login, refresh, profile
        - `RoomController.java` — Rooms CRUD and membership
        - `MessageController.java` — Messages, polls, likes, votes, queries
      - `entities/` — JPA entities (Person, Room, Message, PollOption, LikeMessage, Vote, etc.)
      - `model/` — DTOs for responses (e.g., `MessageDTO`)
      - `request/`, `response/`, `service/` — DTOs, response models, services (JWT, room, person, message/poll/like/vote)
    - `src/main/resources/application.properties` — App/server/db/JPA config
    - Dockerfile — Multi-stage build (Maven + JRE)
  - `NodeJsBackend/` — Socket.IO server
    - `server.js` — Room-based realtime events
    - Dockerfile — Node 18 Alpine
    - `package.json`
- `Frontend/frontend/` — React app (Vite)
  - `src/` — Pages/components, `config.js` for API/SOCKET URLs
  - `Dockerfile` — Build with Vite, serve static via `serve`
  - `nginx.conf` — Present but not used by current Dockerfile
- `DataBase/Queries.sql` — Optional DB creation/seed hook (db `test_temp`)

---

## Architecture

- Spring Boot REST API
  - Port 8081
  - MySQL 8 storage; JPA/Hibernate DDL auto-update
  - JWT auth for protected endpoints (Authorization: Bearer <token>)
- Node.js Socket.IO service
  - Port 3000
  - Handles realtime room events: join, message, vote, like/unlike, membership actions, rename/end room
- React frontend (Vite build)
  - Served statically (port 5173) in Docker via `serve`
  - Talks to Java API and Socket.IO
- MySQL database
  - Port 3306 (exposed)
  - Data persisted to a Docker volume (`mysql_data`)

---

## Getting started

### Option A: Run everything with Docker Compose

Requirements:
- Docker + Docker Compose

Steps:
1) Create a `.env` (optional; see config section) or use defaults.
2) From repo root, build and start services:

```powershell
# Windows PowerShell
docker compose up --build -d
```

3) Wait for MySQL to become healthy (Compose is configured with a healthcheck). Then access:
- Frontend: http://localhost:5173
- API: http://localhost:8081
- Socket.IO: ws/http at http://localhost:3000

To stop:

```powershell
docker compose down
```

To view logs for a service (examples):

```powershell
docker compose logs -f java-backend
# or
docker compose logs -f nodejs-backend
```

### Option B: Local development (no Docker)

Requirements:
- Java 17
- Maven 3.9+
- Node.js 18+
- MySQL 8 (local) with database `test_temp`

1) MySQL
- Start MySQL on 3306
- Create database `test_temp`
- Optional: run `DataBase/Queries.sql` (only creates DB; JPA will create tables)

2) Java backend (Spring Boot)

```powershell
cd Backend/main
# Install deps and run
yarn --version >$null 2>&1; mvn spring-boot:run
# Alternatively
mvn clean package -DskipTests ; java -jar target/main-0.0.1-SNAPSHOT.jar
```

By default it listens on `http://localhost:8081`. Configure DB via `application.properties` or env vars (see config).

3) Node.js realtime server

```powershell
cd Backend/NodeJsBackend
npm install
node server.js
```

Listens on `http://localhost:3000`.

4) Frontend (React + Vite)

Update `Frontend/frontend/src/config.js` or use Vite env vars to point to your API/SOCKET URLs (see config section), then run:

```powershell
cd Frontend/frontend
npm install
npm run dev
```

Vite dev server runs on `http://localhost:5173`.

---

## Configuration

### Environment variables

Docker Compose sets sane defaults (see `docker-compose.yml`):
- MySQL
  - MYSQL_ROOT_PASSWORD=Aniket
  - MYSQL_DATABASE=test_temp
  - MYSQL_USER=app_user
  - MYSQL_PASSWORD=app_password
- Java backend
  - SPRING_DATASOURCE_URL=jdbc:mysql://mysql-db:3306/test_temp?allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC
  - SPRING_DATASOURCE_USERNAME=root
  - SPRING_DATASOURCE_PASSWORD=Aniket
  - SPRING_JPA_HIBERNATE_DDL_AUTO=update
- Node backend
  - PORT=3000

Spring `application.properties` supports env overrides with defaults:
- server.port=8081
- spring.datasource.url=${SPRING_DATASOURCE_URL:jdbc:mysql://localhost:3306/test_temp}
- spring.datasource.username=${SPRING_DATASOURCE_USERNAME:root}
- spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:Aniket}
- spring.jpa.hibernate.ddl-auto=${SPRING_JPA_HIBERNATE_DDL_AUTO:create}

### Frontend endpoints

`Frontend/frontend/src/config.js` currently hardcodes:
- API_BASE = http://172.31.123.75:8081
- SOCKET_URL = http://172.31.123.75:3000

Recommended: use Vite env variables instead. Create `Frontend/frontend/.env.local`:

```
VITE_API_BASE_URL=http://localhost:8081
VITE_SOCKET_URL=http://localhost:3000
```

Then in `config.js` consume via `import.meta.env` (already scaffolded in comments), or replace hardcoded IPs with dynamic host detection.

### CORS and WebSockets

- Global CORS (Spring) allows origins: `http://localhost:5173`, `http://localhost:3000` and methods GET, POST, PUT, DELETE, OPTIONS, PATCH; credentials allowed.
- STOMP endpoint `/ws` exists with allowed origin `http://localhost:5173`. The message broker config is commented out; the live realtime channel is Socket.IO via Node service.

---

## API overview (REST)

Base URL: `http://localhost:8081`

Auth and tokens:
- POST `/auth/v1/signup`
  - Body: `{ name: string, email: string, password: string }`
  - 200: "Successfully Account Created"; 400 if email exists
- POST `/auth/v1/login`
  - Body: `{ email: string, password: string }`
  - 200: `{ token: string, refreshToken: string }`
- POST `/auth/v1/refreshToken`
  - Body: `{ token: string }` (refresh token)
  - 200: `{ token: string, refreshToken: string }` (new JWT)
- GET `/user/Profile`
  - Header: `Authorization: Bearer <JWT>`
  - 200: `Person`

Example DTOs:
- PersonDTO (signup):
  ```json
  { "name": "Alice", "email": "alice@example.com", "password": "secret" }
  ```
- AuthRequestDTO (login):
  ```json
  { "email": "alice@example.com", "password": "secret" }
  ```
- RefreshTokenRequestDTO:
  ```json
  { "token": "<refresh-token>" }
  ```

Rooms (all require `Authorization: Bearer <JWT>`) :
- POST `/user/createRoom`
  - Body: `{ roomName: string }`
  - 200: `Room`
- POST `/user/joinRoom`
  - Body: `{ roomId: number }`
  - 200: "Joined Room <name>"
- GET `/user/allRoom`
  - 200: `Room[]` (rooms the user belongs to)
- PATCH `/user/room/rename`
  - Body: `{ roomId: number, newName: string }`
  - 200: `Room`
- PATCH `/user/room/authenticateUser`
  - Body: `{ roomId: number, userId: string }` (admin authenticates pending user)
  - 200: "Successfully Added User"
- POST `/user/room/allUser`
  - Body: `{ roomId: number }`
  - 200: `BelongToRoom[]`
- DELETE `/user/room/removeUser`
  - Body: `{ roomId: number, userId: string }` (admin removes a user)
  - 200: "Successfully Removed User"
- DELETE `/user/room/leaveRoom`
  - Body: `{ roomId: number }` (non-admin leaves)
  - 200: "Successfully Removed User"
- DELETE `/user/room/deleteRoom`
  - Body: `{ roomId: number }` (admin ends room)
  - 200: "Successfully Ended Room"
- POST `/user/room/isUserAuthorized`
  - Body: `{ roomId: number }`
  - 200: `true` if authenticated and not exited; otherwise 400/false

Messages, polls, likes, votes (all require `Authorization: Bearer <JWT>`) :
- POST `/user/room/message/send`
  - Body: `{ roomId: number, text: string, taggedMessage?: number, isAnonymous: boolean, isPoll: boolean }`
  - 200: `MessageDTO`
- POST `/user/room/poll/send`
  - Body: `{ roomId: number, text: string, taggedMessage?: number, isAnonymous: boolean, isPoll: true, pollOptions: string[] }`
  - 200: `MessageDTO` (with poll options)
- POST `/user/room/getMessages`
  - Body: `{ roomId: number }`
  - 200: `MessageDTO[]` (messages with poll info for the room)
- PATCH `/user/room/poll/vote`
  - Body: `{ optId: number }`
  - 200: `Vote`
- PATCH `/user/room/message/like`
  - Body: `{ messageId: number }`
  - 200: `LikeMessage`
- PATCH `/user/room/message/unlike`
  - Body: `{ messageId: number }`
  - 200: `LikeMessage`

Example DTOs:
- RequestMessageDTO:
  ```json
  {
    "roomId": 1,
    "text": "Hello room!",
    "taggedMessage": null,
    "isAnonymous": false,
    "isPoll": false
  }
  ```
- RequestPollDTO:
  ```json
  {
    "roomId": 1,
    "text": "Which option do you prefer?",
    "taggedMessage": null,
    "isAnonymous": false,
    "isPoll": true,
    "pollOptions": ["A", "B", "C"]
  }
  ```
- RequestAllMessagesDTO:
  ```json
  { "roomId": 1 }
  ```
- Vote request:
  ```json
  { "optId": 10 }
  ```
- Like/Unlike request:
  ```json
  { "messageId": 42 }
  ```

Notes:
- Most non-auth responses use 401/400; admin checks enforce rename/delete/remove operations
- Some non-critical responses and logs are simplistic and may be refined in future iterations

---

## Realtime events (Socket.IO)

Base: `http://localhost:3000`

Events emitted/handled in `server.js`:
- `joinRoom` — client joins a room
  - Payload: `roomId: string | number`
- `message` — broadcast to room
  - Payload: `{ room: string | number, message: string }`
  - Emitted back to room: `{ user: <socket.id>, message }`
- `vote` — broadcast a vote delta
  - Payload: `{ option: { message: { room: { roomId } }, ... }, ... }`
  - Emitted to `roomId` as `vote`
- `like` / `unlike` — broadcast like state changes
  - Payload: `{ message: { room: { roomId } }, ... }`
- `rejectUser` / `acceptUser` — membership moderation events
  - Payload: `{ roomId, ... }`
- `renameGroup` — rename room event
  - Payload: `{ roomId, newName, ... }`
- `endGroup` — end room event
  - Payload: `{ roomId, ... }`
- `leaveRoom` — client leaves a room

Client connection example:

```js
import { io } from 'socket.io-client';
const socket = io('http://localhost:3000', { transports: ['websocket'] });
socket.emit('joinRoom', '123');
socket.emit('message', { room: '123', message: 'Hello' });
```

---

## Data model

Tables and relations (simplified):
- `person` — users
- `session_token` — refresh/session token per user (token, expiry)
- `room` — room metadata (name, admin, isEnded)
- `belong_to_room` — user-to-room with flags (isAuthenticated, isExited)
- `message` — messages and polls; can reference a tagged message
- `poll_options` — options per poll message
- `vote` — user votes per poll option

`DataBase/Queries.sql` includes DB creation for `test_temp`. Schema is managed by JPA with `spring.jpa.hibernate.ddl-auto=update`.

---

## Frontend notes

- React 18 + Vite 6 + TailwindCSS
- Routing: `react-router-dom`
- Realtime: `socket.io-client`
- Optional STOMP: `@stomp/stompjs` + `sockjs-client` are present; Spring STOMP broker is currently disabled
- Global endpoints in `src/config.js`; consider switching to Vite envs for portability

### Screenshots / branding

You can add a logo to `Frontend/frontend/public/` and reference it here. Example placeholders:
- Home page
- Sign in / Sign up
- Chat room with poll and likes

Update this section with actual images for a more visual README.

---

## Useful scripts

Frontend (`Frontend/frontend/package.json`):
- `npm run dev` — Vite dev server (5173)
- `npm run build` — build to `dist`
- `npm run preview` — preview built assets
- `npm run lint` — ESLint

Node backend (`Backend/NodeJsBackend`):
- `node server.js` — start Socket.IO server

Java backend (`Backend/main`):
- Maven build: `mvn clean package -DskipTests`
- Run dev: `mvn spring-boot:run`

---

## Troubleshooting

- Frontend can’t reach API/Socket.IO
  - Ensure `API_BASE` and `SOCKET_URL` point to reachable hosts (Docker host vs container IP)
  - In Docker, use `http://localhost:8081` and `http://localhost:3000` from the host
- MySQL connection errors
  - Verify credentials and `SPRING_DATASOURCE_URL`
  - Wait for Compose healthcheck before starting backend or let Compose handle dependency
- CORS issues
  - Check `SecurityConfig` allowed origins; add your host if different
- Token expired / 401s
  - Use `/auth/v1/refreshToken` with the stored refresh token

---

## Roadmap and improvements

- Enable and use Spring STOMP message broker or align fully on Socket.IO
- Standardize API responses (problem+json), validation errors, and improve messages
- Replace hardcoded frontend endpoints with Vite envs by default
- Add integration tests and OpenAPI/Swagger documentation
- Add role-based authorization and rate limiting for sensitive endpoints
- Production frontend serving via Nginx or CDN

---

## License

No license declared yet. Add one if you plan to distribute.
