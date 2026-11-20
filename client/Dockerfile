FROM node:20-alpine AS deps
WORKDIR /app
COPY client/package*.json ./client/
COPY shared ./shared/
WORKDIR /app/client
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY client/ ./client/
COPY shared ./shared/
WORKDIR /app/client

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app/client

ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/client/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/client/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
