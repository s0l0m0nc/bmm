FROM oven/bun:1-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json bun.lock .

RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN export IGNORE_BUILD_ERRORS=true && bun next build
RUN rm -rf doc .next/cache .next/trace

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
RUN apk add bash
COPY --from=builder /app .

EXPOSE 3000

CMD ["bun", "run", "start"]
