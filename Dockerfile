# ============================================
# FreshFruit - Production Dockerfile
# Next.js 15 + Prisma + SQL Server
# ============================================

# Stage 1: Dependencies & Build
FROM node:20-alpine AS builder

WORKDIR /app

# Install ALL deps (including devDependencies) for build - Coolify may inject NODE_ENV=production
# which would skip devDependencies and break next build (Tailwind/PostCSS missing)
COPY package.json package-lock.json ./
COPY prisma ./prisma/

RUN npm ci --include=dev

# Generate Prisma Client
RUN npx prisma generate

# Copy source and build
COPY . .

# Build Next.js (output: standalone)
RUN npm run build

# Prepare standalone: copy static & public (not included by default)
RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema & migrations (app uses @prisma/client from standalone)
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Coolify need wget (or curl) for healthcheck; also helps HEALTHCHECK in Dockerfile work
RUN apk add --no-cache wget

# Prisma CLI for migrations: install in separate dir so all deps (effect, etc.) are available
RUN mkdir -p /prisma-cli && echo '{"name":"prisma-cli","private":true,"dependencies":{"prisma":"6.19.0"}}' > /prisma-cli/package.json
RUN cd /prisma-cli && npm install

# Entrypoint: run migrations then start server (fix CRLF if committed from Windows)
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN sed -i 's/\r$//' /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 3000

# Use ${PORT} at runtime (Coolify injects port, e.g. 30301); shell to expand variable; wget as per Coolify requirement
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD sh -c 'wget -q -O /dev/null "http://127.0.0.1:${PORT:-3000}/" || exit 1'

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "server.js"]
