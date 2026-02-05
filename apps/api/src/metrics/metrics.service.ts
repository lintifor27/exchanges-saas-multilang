import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunityType } from '@prisma/client';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const [exchanges, cexCount, triCount, p2pCount, alerts] = await Promise.all([
      this.prisma.exchange.count(),
      this.prisma.opportunity.count({ where: { type: OpportunityType.CEX } }),
      this.prisma.opportunity.count({ where: { type: OpportunityType.TRI } }),
      this.prisma.opportunity.count({ where: { type: OpportunityType.P2P } }),
      this.prisma.alert.count(),
    ]);
    return {
      exchanges,
      opportunities: {
        cex: cexCount,
        tri: triCount,
        p2p: p2pCount,
      },
      alerts,
    };
  }
}