FROM node:18-alpine AS builder
WORKDIR /usr/src/app
COPY ../../package.json ../../tsconfig.json ./
COPY ../../apps ./apps
COPY ../../packages ./packages
COPY ../../prisma ./prisma
RUN npm install
RUN npx prisma generate
RUN npm run -w apps/worker build

FROM node:18-alpine
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/worker/dist ./dist
COPY --from=builder /usr/src/app/apps/worker/package.json ./package.json
COPY --from=builder /usr/src/app/prisma ./prisma
CMD ["node", "dist/main.js"]