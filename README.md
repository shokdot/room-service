# Room Service

Room and matchmaking microservice for the ft_transcendence platform. Handles game rooms (create, list, join, leave, delete), invitations (create, accept, decline), and matchmaking queue (enter, leave).

## Features

- **Rooms**: Create room, get rooms (optional filter), join, leave, delete
- **Invitations**: Create invitation, accept, decline
- **Matchmaking**: Enter queue, leave queue (auto-match into room)

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Fastify 5
- **Auth**: JWT Bearer (via core)

## Quick Start

### Prerequisites

- Node.js 20+
- Environment variables (see [Environment](#environment))

### Install & Run

```bash
npm install
npm run dev
```

- **Dev**: `npm run dev`
- **Build**: `npm run build`
- **Start**: `npm start` (production)

Service listens on `HOST:PORT` (default `0.0.0.0:3004`).

### Docker

Built from monorepo root; see project `Dockerfile` and `docker-compose*.yml`.

## Environment

| Variable                     | Required | Description                    |
|-----------------------------|----------|--------------------------------|
| `PORT`                      | No       | Server port (default: 3004)    |
| `HOST`                      | No       | Bind address (default: 0.0.0.0)|
| `SERVICE_TOKEN`             | Yes      | Service-to-service token       |
| `JWT_SECRET`                | Yes      | Access token verification      |
| `JWT_REFRESH_SECRET`        | Yes      | Refresh token (if needed)      |
| `JWT_TWO_FA`                | Yes      | 2FA token (if needed)          |
| `GAME_SERVICE_URL`          | Yes      | Game service base URL          |
| `CHAT_SERVICE_URL`          | Yes      | Chat service base URL          |
| `NOTIFICATION_SERVICE_URL`  | Yes      | Notification service base URL  |
| `STATS_SERVICE_URL`         | Yes      | Stats service base URL         |

API prefix defaults to `/api/v1` (from core).

## API Base URL

All room routes are under:

```
{baseUrl}/api/v1/rooms
```

- Rooms: `GET /`, `POST /`, `DELETE /:roomId`, `POST /:roomId/join`, `POST /:roomId/leave`
- Invitations: `POST /invitations`, `POST /invitations/:invitationId/accept`, `POST /invitations/:invitationId/decline`
- Matchmaking: `POST /matchmaking/queue`, `DELETE /matchmaking/queue`

## Documentation

- **[API Endpoints](docs/api-endpoints.md)** — Full list of endpoints, request/response bodies, and error format.
- **[Frontend Integration Guide](docs/frontend-integration-guide.md)** — Flows and usage from React/Next.js.

## Project Structure

```
src/
├── controllers/   # external, internal, invitation, matchmaking
├── services/      # Business logic
├── routes/        # Route definitions
├── schemas/       # Validation & OpenAPI-style schemas
├── managers/       # Room, Invitation, MatchmakingQueue
├── dto/            # Data transfer types
└── utils/          # env
```

## License

Part of ft_transcendence project.
