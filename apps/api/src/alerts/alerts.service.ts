import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunityType } from '@prisma/client';

@Injectable()
export class AlertsService {
  constructor(private readonly prisma: PrismaService) {}

  createAlert(data: { userId: string; type: OpportunityType; threshold: number; params: any }) {
    return this.prisma.alert.create({
      data: {
        userId: data.userId,
        type: data.type,
        threshold: data.threshold,
        params: data.params,
      },
    });
  }

  findAllByUser(userId: string) {
    return this.prisma.alert.findMany({ where: { userId } });
  }
}