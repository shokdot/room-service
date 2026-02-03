# Frontend Integration Guide — Room Service

How a **React/Next.js** frontend should use the Room Service: flows, requests, and patterns.

---

## Base URL and auth

- **Base URL**: `{ROOM_SERVICE_URL}/api/v1/rooms`
- **Auth**: Send access token (from Auth Service) as `Authorization: Bearer <accessToken>` on every request.

---

## 1. List rooms

**Purpose:** Show lobby / list of game rooms.

**Request:** `GET /api/v1/rooms?available=true` (optional query: `available=true` for only joinable rooms).

**Flow:** Call with Bearer token; render `data` array (id, createdBy, status, players, winScore). Use room `id` for join/leave/delete.

---

## 2. Create room

**Purpose:** User creates a new game room.

**Request:** `POST /api/v1/rooms` with optional body `{ "winScore": 11 }` (1–30).

**Flow:** On 201, use `data.id` to redirect to room/game (e.g. open game WebSocket or game page with `roomId`).

---

## 3. Join / leave room

**Purpose:** User joins or leaves a room.

**Requests:**

- Join: `POST /api/v1/rooms/:roomId/join`
- Leave: `POST /api/v1/rooms/:roomId/leave`

**Flow:** On success, update UI (e.g. leave lobby and open game for that `roomId`, or return to lobby on leave).

---

## 4. Delete room

**Purpose:** Creator (or allowed role) deletes a room.

**Request:** `DELETE /api/v1/rooms/:roomId`

**Flow:** On success, remove room from list and/or redirect to lobby.

---

## 5. Matchmaking

**Purpose:** Find a random opponent; backend may create a room and return it.

**Flow:**

1. **Enter queue:** `POST /api/v1/rooms/matchmaking/queue` (no body).
2. Response: `data.matched` and `data.roomId`.
3. If `matched === true`, redirect or connect to game using `roomId`.
4. **Leave queue:** `DELETE /api/v1/rooms/matchmaking/queue` (e.g. when user clicks "Cancel").

**Request example (enter queue):**

```ts
const res = await fetch(`${ROOMS_BASE}/matchmaking/queue`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${accessToken}` },
});
const json = await res.json();
if (json.data?.matched && json.data.roomId) {
  router.push(`/game/${json.data.roomId}`);
}
```

---

## 6. Invitations

**Purpose:** Invite a user to a game (invitation is delivered via chat).

**Create invitation:** `POST /api/v1/rooms/invitations` with body `{ "inviteeId": "<userId>" }`.  
On success, invitee sees the invite (e.g. in chat or notifications). They can **accept** or **decline**.

**Accept:** `POST /api/v1/rooms/invitations/:invitationId/accept`  
**Decline:** `POST /api/v1/rooms/invitations/:invitationId/decline`

**Flow:** From chat/notifications, show "Accept" / "Decline"; on accept, use returned room/game info to navigate to game.

---

## Quick reference

| User action       | Request                                      | Then                          |
|-------------------|----------------------------------------------|-------------------------------|
| View rooms        | `GET /rooms?available=true`                 | Render list                   |
| Create room       | `POST /rooms` (+ optional winScore)         | Go to game with roomId        |
| Join room         | `POST /rooms/:roomId/join`                   | Go to game                    |
| Leave room        | `POST /rooms/:roomId/leave`                  | Back to lobby                 |
| Delete room       | `DELETE /rooms/:roomId`                       | Update list / redirect        |
| Find match        | `POST /rooms/matchmaking/queue`              | If matched, go to game        |
| Cancel matchmaking| `DELETE /rooms/matchmaking/queue`             | Stay in lobby                 |
| Invite user       | `POST /rooms/invitations` (inviteeId)        | Invite sent via chat          |
| Accept invite     | `POST /rooms/invitations/:id/accept`        | Go to game                    |
| Decline invite    | `POST /rooms/invitations/:id/decline`       | Close invite UI               |

Use the same access token as for Auth Service; on 401, refresh token and retry (see Auth Service frontend guide).
