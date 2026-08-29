FROM node:22.23.2-bookworm-slim AS dependencies

WORKDIR /app

RUN apt-get update \
    && apt-get install --yes --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS build

COPY nest-cli.json tsconfig.json tsconfig.build.json prisma.config.ts ./
COPY prisma ./prisma
COPY src ./src

RUN npm run build

FROM build AS migration

ENV NODE_ENV=production
USER node

CMD ["sh", "-c", "npm run db:migrate && npm run db:seed"]

FROM dependencies AS production-dependencies

RUN npm prune --omit=dev && npm cache clean --force

FROM node:22.23.2-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=3000

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node --from=production-dependencies /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

USER node

EXPOSE 3000

CMD ["node", "dist/main.js"]
