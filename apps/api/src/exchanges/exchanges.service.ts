import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExchangesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.exchange.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(slug: string) {
    const exchange = await this.prisma.exchange.findUnique({ where: { slug } });
    if (!exchange) throw new NotFoundException('Exchange not found');
    return exchange;
  }
}