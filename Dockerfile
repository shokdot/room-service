FROM node:20 AS builder

WORKDIR /apps

COPY core/package*.json core/
COPY core/tsconfig.json core/
COPY core/src core/src

WORKDIR /apps/core
RUN npm install && npm run build

WORKDIR /apps

COPY room-service/package*.json room-service/
COPY room-service/tsconfig.json room-service/
COPY room-service/tsup.config.ts room-service/
COPY room-service/src room-service/src

WORKDIR /apps/room-service

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /apps

COPY --from=builder /apps/core/dist core/dist
COPY --from=builder /apps/room-service/dist room-service/dist
COPY --from=builder /apps/room-service/package*.json room-service/

WORKDIR /apps/room-service

RUN npm install --omit=dev

EXPOSE 3000

CMD ["npm", "run", "start"]
