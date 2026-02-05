-- Initial migration
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'USER');
CREATE TYPE "OpportunityType" AS ENUM ('CEX', 'TRI', 'P2P');

CREATE TABLE "User" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "email" text NOT NULL,
  "password" text NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");

CREATE TABLE "Exchange" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "logoUrl" text NOT NULL,
  "ccxtId" text NOT NULL,
  "regions" text[] NOT NULL,
  "makerFee" double precision,
  "takerFee" double precision,
  "withdrawNetworks" text[] NOT NULL,
  "p2pSupported" boolean NOT NULL DEFAULT false,
  "scannerEnabled" boolean NOT NULL DEFAULT true,
  "p2pAdapter" text,
  "scannerConfig" jsonb,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

ALTER TABLE "Exchange" ADD CONSTRAINT "Exchange_slug_key" UNIQUE ("slug");

CREATE TABLE "Market" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "exchangeId" uuid NOT NULL,
  "symbol" text NOT NULL,
  "base" text NOT NULL,
  "quote" text NOT NULL,
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

CREATE INDEX "Market_exchangeId_symbol_idx" ON "Market" ("exchangeId", "symbol");

CREATE TABLE "Review" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  "exchangeId" uuid NOT NULL,
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

CREATE TABLE "Opportunity" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "type" "OpportunityType" NOT NULL,
  "details" jsonb NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

CREATE INDEX "Opportunity_type_createdAt_idx" ON "Opportunity" ("type", "createdAt");

CREATE TABLE "Alert" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  "type" "OpportunityType" NOT NULL,
  "threshold" double precision NOT NULL,
  "params" jsonb NOT NULL,
  "active" boolean NOT NULL DEFAULT true,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  "updatedAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

ALTER TABLE "Market" ADD CONSTRAINT "Market_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_exchangeId_fkey" FOREIGN KEY ("exchangeId") REFERENCES "Exchange"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;