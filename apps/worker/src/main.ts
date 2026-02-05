import { PrismaClient, OpportunityType } from '@prisma/client';
import Redis from 'ioredis';
import * as ccxt from 'ccxt';
import pino from 'pino';
import { calculateSpread, calculateNetSpread } from '@exchanges/util';

const prisma = new PrismaClient();
const redis = new Redis({ host: process.env.REDIS_HOST || 'localhost', port: parseInt(process.env.REDIS_PORT || '6379') });
const logger = pino();

async function scanCex() {
  try {
    const exchanges = await prisma.exchange.findMany({ where: { scannerEnabled: true } });
    const symbol = 'BTC/USDT';
    const orderbooks: Record<string, { bid: number; ask: number }> = {};
    // instantiate ccxt clients
    const clients: Record<string, any> = {};
    for (const ex of exchanges) {
      try {
        // @ts-ignore
        const cls = (ccxt as any)[ex.ccxtId];
        if (!cls) continue;
        const client = new cls({ enableRateLimit: true });
        clients[ex.slug] = client;
      } catch (err) {
        logger.warn({ err }, `Failed to init ccxt client for ${ex.slug}`);
      }
    }
    // fetch orderbooks concurrently
    await Promise.all(
      Object.keys(clients).map(async (slug) => {
        try {
          const ob = await clients[slug].fetchOrderBook(symbol);
          if (ob?.bids?.length && ob?.asks?.length) {
            orderbooks[slug] = { bid: ob.bids[0][0], ask: ob.asks[0][0] };
          }
        } catch (err) {
          logger.warn({ err }, `Orderbook fetch failed for ${slug}`);
        }
      }),
    );
    // compute pairwise spreads
    const now = new Date();
    for (const buyEx of exchanges) {
      for (const sellEx of exchanges) {
        if (buyEx.slug === sellEx.slug) continue;
        const obA = orderbooks[buyEx.slug];
        const obB = orderbooks[sellEx.slug];
        if (!obA || !obB) continue;
        const gross = calculateSpread(obB.bid, obA.ask);
        const net = calculateNetSpread({ bid: obB.bid, ask: obA.ask, makerFee: buyEx.makerFee || 0, takerFee: sellEx.takerFee || 0 });
        const minSpread = (buyEx.scannerConfig as any)?.minSpread || 0;
        if (net > minSpread) {
          const details = {
            symbol,
            buyExchange: buyEx.slug,
            sellExchange: sellEx.slug,
            ask: obA.ask,
            bid: obB.bid,
            gross,
            net,
          };
          const opportunity = await prisma.opportunity.create({
            data: {
              type: OpportunityType.CEX,
              details,
            },
          });
          // publish to redis
          await redis.publish('opportunity:cex', JSON.stringify(opportunity));
        }
      }
    }
  } catch (err) {
    logger.error({ err }, 'scanCex error');
  }
}

async function scanTri() {
  try {
    const exchanges = await prisma.exchange.findMany({ where: { scannerEnabled: true } });
    // generate fake triangular opportunities for demonstration
    for (const ex of exchanges) {
      const net = Math.random() * 2 - 0.5; // between -0.5 and 1.5
      if (net > 0) {
        const details = {
          exchange: ex.slug,
          cycle: ['BTC/USDT', 'USDT/ETH', 'ETH/BTC'],
          net,
          volume: 1,
        };
        const op = await prisma.opportunity.create({
          data: {
            type: OpportunityType.TRI,
            details,
          },
        });
        await redis.publish('opportunity:tri', JSON.stringify(op));
      }
    }
  } catch (err) {
    logger.error({ err }, 'scanTri error');
  }
}

async function scanP2P() {
  try {
    const exchanges = await prisma.exchange.findMany({ where: { p2pSupported: true, scannerEnabled: true } });
    for (const ex of exchanges) {
      const margin = Math.random() * 3 - 0.5; // -0.5 to 2.5
      if (margin > 0) {
        const details = {
          exchange: ex.slug,
          buy: `${ex.slug} P2P`,
          sell: `${ex.slug} Spot`,
          fiat: 'UAH',
          margin,
        };
        const op = await prisma.opportunity.create({
          data: {
            type: OpportunityType.P2P,
            details,
          },
        });
        await redis.publish('opportunity:p2p', JSON.stringify(op));
      }
    }
  } catch (err) {
    logger.error({ err }, 'scanP2P error');
  }
}

async function start() {
  const interval = parseInt(process.env.SCAN_INTERVAL || '10');
  logger.info(`Worker started with scan interval ${interval}s`);
  setInterval(scanCex, interval * 1000);
  setInterval(scanTri, interval * 1000 * 3);
  setInterval(scanP2P, interval * 1000 * 5);
  // run immediately
  await scanCex();
  await scanTri();
  await scanP2P();
}

start().catch((err) => {
  logger.error(err);
  process.exit(1);
});