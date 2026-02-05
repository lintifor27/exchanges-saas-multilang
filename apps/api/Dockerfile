FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy monorepo files
COPY ../../package.json ../../tsconfig.json ./
COPY ../../apps ./apps
COPY ../../packages ./packages
COPY ../../prisma ./prisma

# Install dependencies (production and workspace resolution)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Build API
RUN npm run -w apps/api build

FROM node:18-alpine
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/api/dist ./apps/api/dist
COPY --from=builder /usr/src/app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /usr/src/app/prisma ./prisma

WORKDIR /usr/src/app/apps/api
EXPOSE 3001
CMD ["node", "dist/main.js"]