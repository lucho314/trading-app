FROM node:20-alpine

RUN apk add --no-cache bash libc6-compat
RUN npm install -g pnpm@8.6.11

WORKDIR /usr/src/app

# Copia solo manifests primero (para aprovechar cache)
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml* ./
COPY apps/backend/package.json apps/backend/

RUN pnpm install --filter backend...

# Ahora sí copia el código fuente (pero no node_modules porque está en .dockerignore)
COPY apps/backend ./apps/backend

RUN pnpm --filter backend exec prisma generate

RUN pnpm --filter backend  build

EXPOSE 8001
CMD ["node", "apps/backend/dist/src/main.js"]

