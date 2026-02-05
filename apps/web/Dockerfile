FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy monorepo
COPY ../../package.json ../../tsconfig.json ./
COPY ../../apps ./apps
COPY ../../packages ./packages
COPY ../../prisma ./prisma

RUN npm install

RUN npm run -w apps/web build

FROM node:18-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/web/.next ./.next
COPY --from=builder /usr/src/app/apps/web/package.json ./package.json
COPY --from=builder /usr/src/app/apps/web/public ./public
COPY --from=builder /usr/src/app/apps/web/next.config.mjs ./next.config.mjs
EXPOSE 3000
CMD ["npx", "next", "start"]