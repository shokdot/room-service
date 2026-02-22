# Room Service

> Part of the [ft_transcendence](https://github.com/shokdot/ft_transcendence) project.

Room and matchmaking microservice. Manages game rooms (create, list, join, leave, delete), direct game invitations (create, accept, decline), and a matchmaking queue that auto-pairs players into rooms.

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify 5
- **Auth**: JWT Bearer (via core)

## Quick Start

```bash
npm install
npm run dev
```

Service listens on `HOST:PORT` (default `0.0.0.0:3004`).

### Docker

Built from monorepo root; see project `Dockerfile` and `docker-compose*.yml`.

## Environment

| Variable                     | Required | Description                      |
|------------------------------|----------|----------------------------------|
| `PORT`                       | No       | Server port (default: 3004)      |
| `HOST`                       | No       | Bind address (default: 0.0.0.0)  |
| `SERVICE_TOKEN`              | Yes      | Service-to-service token         |
| `JWT_SECRET`                 | Yes      | Access token verification        |
| `GAME_SERVICE_URL`           | Yes      | Game service base URL            |
| `CHAT_SERVICE_URL`           | Yes      | Chat service base URL            |
| `NOTIFICATION_SERVICE_URL`   | Yes      | Notification service base URL    |
| `STATS_SERVICE_URL`          | Yes      | Stats service base URL           |

---

## API Endpoints

Base URL: **`{ROOM_SERVICE_URL}/api/v1/rooms`**

All endpoints require **Bearer** access token in `Authorization` header.

### Error Response Format

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": null
  }
}
```

---

### Rooms

#### `GET /`

List all rooms or filter by availability. **Auth: Bearer**

**Query:** `available=true` — return only available (waiting) rooms. Omit for all rooms.

**Success (200):**

```json
{
  "status": "success",
  "data": [
    {
      "id": "string",
      "createdBy": "uuid",
      "createdAt": "date-time",
      "status": "waiting|playing|finished",
      "players": ["uuid"],
      "winScore": 5
    }
  ],
  "count": 1
}
```

---

#### `POST /`

Create a new game room. **Auth: Bearer**

**Body:**

| Field    | Type   | Required | Description                   |
|----------|--------|----------|-------------------------------|
| winScore | number | No       | Score to win, 1–30 (optional) |

**Success (201):**

```json
{
  "status": "success",
  "data": {
    "id": "string",
    "createdBy": "uuid",
    "createdAt": "date-time",
    "status": "waiting",
    "players": ["uuid"],
    "winScore": 5
  },
  "message": "..."
}
```

---

#### `DELETE /:roomId`

Delete a room. **Auth: Bearer**

**Params:** `roomId`

**Success (200):** `{ "status": "success", "message": "..." }`

---

#### `POST /:roomId/join`

Join a room. **Auth: Bearer**

**Params:** `roomId`

**Success (200):** `{ "status": "success", "message": "..." }`

---

#### `POST /:roomId/leave`

Leave a room. **Auth: Bearer**

**Params:** `roomId`

**Success (200):** `{ "status": "success", "message": "..." }`

---

### Invitations

#### `POST /invitations`

Create a game invitation (delivered to invitee via chat websocket). **Auth: Bearer**

**Body:**

| Field     | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| inviteeId | string | Yes      | Target user ID (uuid)|

**Success (201):**

```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "inviterId": "uuid",
    "inviteeId": "uuid",
    "status": "pending",
    "createdAt": "date-time",
    "expiresAt": "date-time"
  },
  "message": "..."
}
```

---

#### `POST /invitations/:invitationId/accept`

Accept an invitation. **Auth: Bearer**

**Params:** `invitationId`

**Success (200):** `{ "status": "success", "data": {...}, "message": "..." }`

---

#### `POST /invitations/:invitationId/decline`

Decline an invitation. **Auth: Bearer**

**Params:** `invitationId`

**Success (200):** `{ "status": "success", "message": "..." }`

---

### Matchmaking

#### `POST /matchmaking/queue`

Enter the matchmaking queue. If another player is already waiting, they are instantly matched and a room is created. **Auth: Bearer**

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "matched": true,
    "roomId": "room-uuid"
  },
  "message": "..."
}
```

If `matched` is `true`, use `roomId` to redirect to or join the game (WebSocket in game-service).

---

#### `DELETE /matchmaking/queue`

Leave the matchmaking queue. **Auth: Bearer**

**Success (200):** `{ "status": "success", "message": "..." }`

---

### Summary

| Method | Path                           | Auth   | Purpose            |
|--------|--------------------------------|--------|--------------------|
| GET    | `/`                            | Bearer | List rooms         |
| POST   | `/`                            | Bearer | Create room        |
| DELETE | `/:roomId`                     | Bearer | Delete room        |
| POST   | `/:roomId/join`                | Bearer | Join room          |
| POST   | `/:roomId/leave`               | Bearer | Leave room         |
| POST   | `/invitations`                 | Bearer | Create invitation  |
| POST   | `/invitations/:id/accept`      | Bearer | Accept invitation  |
| POST   | `/invitations/:id/decline`     | Bearer | Decline invitation |
| POST   | `/matchmaking/queue`           | Bearer | Enter queue        |
| DELETE | `/matchmaking/queue`           | Bearer | Leave queue        |
