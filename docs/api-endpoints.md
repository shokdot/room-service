# Room Service — API Endpoints

Base URL: **`{ROOM_SERVICE_URL}/api/v1/rooms`**

All endpoints that require auth use **Bearer** access token in `Authorization` header.

---

## Error response format

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

## Rooms

### GET `/`

Get all rooms or filter by availability. **Auth: Bearer**

**Query:**

| Name       | Type   | Required | Description                                      |
|------------|--------|----------|--------------------------------------------------|
| available  | string | No       | `'true'` = only available rooms; omit = all rooms |

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
      "winScore": number | null
    }
  ],
  "count": number
}
```

---

### POST `/`

Create a new game room. **Auth: Bearer**

**Body:**

| Field    | Type   | Required | Description                    |
|----------|--------|----------|--------------------------------|
| winScore | number | No       | 1–30, score to win (optional)  |

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
    "winScore": number | null
  },
  "message": "string"
}
```

---

### DELETE `/:roomId`

Delete a room. **Auth: Bearer**

**Params:** `roomId` — Room ID

**Success (200):** `{ "status": "success", "message": "string" }`

---

### POST `/:roomId/join`

Join a room. **Auth: Bearer**

**Params:** `roomId`

**Success (200):** `{ "status": "success", "message": "string" }`

---

### POST `/:roomId/leave`

Leave a room. **Auth: Bearer**

**Params:** `roomId`

**Success (200):** `{ "status": "success", "message": "string" }`

---

## Invitations

### POST `/invitations`

Create a game invitation (sent via chat). **Auth: Bearer**

**Body:**

| Field      | Type   | Required | Description      |
|------------|--------|----------|------------------|
| inviteeId  | string | Yes      | User ID (uuid)   |

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
  "message": "string"
}
```

---

### POST `/invitations/:invitationId/accept`

Accept an invitation. **Auth: Bearer**

**Params:** `invitationId`

**Success (200):** `{ "status": "success", "data": {...}, "message": "string" }`

---

### POST `/invitations/:invitationId/decline`

Decline an invitation. **Auth: Bearer**

**Params:** `invitationId`

**Success (200):** `{ "status": "success", "message": "string" }`

---

## Matchmaking

### POST `/matchmaking/queue`

Enter the matchmaking queue. **Auth: Bearer**

**Success (200):**

```json
{
  "status": "success",
  "data": {
    "matched": boolean,
    "roomId": "string" | null
  },
  "message": "string"
}
```

If `matched` is true, use `roomId` to join/redirect to game.

---

### DELETE `/matchmaking/queue`

Leave the matchmaking queue. **Auth: Bearer**

**Success (200):** `{ "status": "success", "message": "string" }`

---

## Summary

| Method | Path                              | Auth   | Purpose           |
|--------|-----------------------------------|--------|--------------------|
| GET    | `/`                               | Bearer | List rooms         |
| POST   | `/`                               | Bearer | Create room        |
| DELETE | `/:roomId`                        | Bearer | Delete room        |
| POST   | `/:roomId/join`                   | Bearer | Join room          |
| POST   | `/:roomId/leave`                  | Bearer | Leave room         |
| POST   | `/invitations`                    | Bearer | Create invitation  |
| POST   | `/invitations/:id/accept`         | Bearer | Accept invitation  |
| POST   | `/invitations/:id/decline`         | Bearer | Decline invitation |
| POST   | `/matchmaking/queue`               | Bearer | Enter queue        |
| DELETE | `/matchmaking/queue`              | Bearer | Leave queue        |
