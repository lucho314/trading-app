# ---------- Base ----------
FROM node:20-alpine AS base
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- Dependencias ----------
FROM base AS deps
WORKDIR /app
COPY apps/front/package*.json ./
RUN npm ci

# ---------- Build ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY apps/front ./
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Copiamos solo lo necesario del build standalone
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
