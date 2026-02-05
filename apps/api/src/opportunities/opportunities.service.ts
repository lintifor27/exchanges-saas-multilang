import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  getById(id: string) {
    return this.prisma.opportunity.findUnique({ where: { id } });
  }
}