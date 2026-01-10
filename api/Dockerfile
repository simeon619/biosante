# ---- Stage 1: Dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Stage 2: Builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN node ace build

# ---- Stage 3: Runtime ----
FROM node:20-alpine AS runtime
WORKDIR /app

RUN apk add --no-cache postgresql-client shadow

# Créer un utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copier les fichiers nécessaires
COPY --from=builder /app/build .
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN npm ci --omit=dev && \
    chmod +x /usr/local/bin/docker-entrypoint.sh && \
    chown -R appuser:appgroup /app

USER appuser

ENV PORT=3333
ENV HOST=0.0.0.0
ENV NODE_ENV=production

HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
    CMD wget --quiet --spider http://0.0.0.0:3333/health || exit 1

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "./bin/server.js"]
