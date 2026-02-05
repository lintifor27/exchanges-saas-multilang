import { calculateSpread, calculateNetSpread, simulateTriangularArbitrage, normalizeP2POffer } from '@exchanges/util';

describe('spread calculations', () => {
  it('should compute gross spread correctly', () => {
    const spread = calculateSpread(101, 100);
    expect(spread).toBeCloseTo(1);
  });
  it('should compute net spread with fees and withdraw', () => {
    const net = calculateNetSpread({ bid: 101, ask: 100, makerFee: 0.001, takerFee: 0.001, withdrawFee: 0.1 });
    // expected approximate net: (101*(1-0.001) - 0.1 - 100*(1+0.001)) / (100*(1+0.001)) * 100
    expect(net).toBeCloseTo(((101 * 0.999 - 0.1 - 100 * 1.001) / (100 * 1.001)) * 100);
  });
});

describe('triangular arbitrage simulation', () => {
  it('should detect profitless cycle', () => {
    const { netProfit } = simulateTriangularArbitrage({
      ab: { ask: 10, bid: 9.9 },
      bc: { ask: 2, bid: 1.98 },
      ca: { ask: 0.05, bid: 0.049 },
      fees: { ab: 0.001, bc: 0.001, ca: 0.001 },
      amount: 1000,
    });
    expect(netProfit).toBeLessThan(1);
  });
});

describe('P2P normalisation', () => {
  it('should normalise offer fields', () => {
    const offer = normalizeP2POffer({ price: 1, amount: 100, currency: 'usdt', fiat: 'uah', side: 'buy', paymentMethods: ['monobank'], merchantType: 'verified' });
    expect(offer.currency).toBe('USDT');
    expect(offer.fiat).toBe('UAH');
    expect(offer.methods[0]).toBe('MONOBANK');
    expect(offer.merchant).toBe('verified');
  });
});