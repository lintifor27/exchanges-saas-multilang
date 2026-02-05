import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunityType } from '@prisma/client';

@Injectable()
export class ScannerService {
  constructor(private readonly prisma: PrismaService) {}

  getCexOpportunities(limit = 50) {
    return this.prisma.opportunity.findMany({
      where: { type: OpportunityType.CEX },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  getTriOpportunities(limit = 50) {
    return this.prisma.opportunity.findMany({
      where: { type: OpportunityType.TRI },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  getP2POpportunities(limit = 50) {
    return this.prisma.opportunity.findMany({
      where: { type: OpportunityType.P2P },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}