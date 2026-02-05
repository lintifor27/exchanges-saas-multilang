import Decimal from 'decimal.js';

// Calculate gross percentage spread between a bid price on exchange B and ask price on exchange A.
export function calculateSpread(bid: number, ask: number): number {
  if (ask <= 0) return 0;
  return new Decimal(bid).minus(ask).div(ask).times(100).toNumber();
}

// Calculate net spread after fees (maker fee on buy side, taker fee on sell side, optional withdrawal fee).
export function calculateNetSpread(params: {
  bid: number;
  ask: number;
  makerFee: number; // e.g. 0.001 for 0.1%
  takerFee: number;
  withdrawFee?: number; // absolute fee in quote currency
}): number {
  const { bid, ask, makerFee, takerFee, withdrawFee = 0 } = params;
  if (ask <= 0 || bid <= 0) return 0;
  const buyCost = new Decimal(ask).times(1 + makerFee);
  const sellProceeds = new Decimal(bid).times(1 - takerFee).minus(withdrawFee);
  return sellProceeds.minus(buyCost).div(buyCost).times(100).toNumber();
}

// Simulate a triangular arbitrage cycle A/B, B/C, C/A with orderbook depth up to 1 level.
// orderbooks: { pair: { ask: number, bid: number } }
export function simulateTriangularArbitrage(params: {
  ab: { ask: number; bid: number };
  bc: { ask: number; bid: number };
  ca: { ask: number; bid: number };
  fees: { ab: number; bc: number; ca: number };
  amount: number; // starting amount in currency A
}): { netProfit: number; endAmount: number } {
  const { ab, bc, ca, fees, amount } = params;
  let a = new Decimal(amount);
  // buy B with A
  const b = a.div(ab.ask).times(1 - fees.ab);
  // buy C with B
  const c = b.div(bc.ask).times(1 - fees.bc);
  // sell C for A
  const a2 = c.times(ca.bid).times(1 - fees.ca);
  const profit = a2.minus(a);
  return { netProfit: profit.toNumber(), endAmount: a2.toNumber() };
}

// Normalise P2P offer data into a common shape.
export interface RawP2POffer {
  price: number;
  amount: number;
  currency: string;
  fiat: string;
  side: 'buy' | 'sell';
  paymentMethods: string[];
  merchantType?: string;
  timestamp?: number;
}

export interface NormalisedP2POffer {
  price: number;
  minAmount: number;
  maxAmount: number;
  currency: string;
  fiat: string;
  side: 'buy' | 'sell';
  methods: string[];
  merchant: string;
  ts: number;
}

export function normalizeP2POffer(offer: RawP2POffer): NormalisedP2POffer {
  return {
    price: offer.price,
    minAmount: offer.amount,
    maxAmount: offer.amount,
    currency: offer.currency.toUpperCase(),
    fiat: offer.fiat.toUpperCase(),
    side: offer.side,
    methods: offer.paymentMethods.map((m) => m.toUpperCase()),
    merchant: offer.merchantType || 'unknown',
    ts: offer.timestamp || Date.now(),
  };
}