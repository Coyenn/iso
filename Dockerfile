#### DEPENDENCIES

FROM oven/bun:latest AS deps
WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

#### BUILDER

FROM oven/bun:latest AS builder
ENV NEXT_TELEMETRY_DISABLED=1
ENV SKIP_ENV_VALIDATION=1
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/bun.lockb ./bun.lockb
COPY . .

RUN bun run build

#### RUNNER

FROM oven/bun:latest AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP_DATA_PATH=/config
ENV APP_PATH=/app

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

CMD ["server.js"]