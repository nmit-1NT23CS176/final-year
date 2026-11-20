FROM node:20-alpine AS builder

WORKDIR /app

COPY server/package*.json ./server/
COPY shared ./shared/
WORKDIR /app/server
RUN npm install

COPY server/ ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/server

ENV NODE_ENV=production \
    PORT=5000

COPY server/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/shared ../shared

EXPOSE 5000

CMD ["node", "dist/server/src/index.js"]
