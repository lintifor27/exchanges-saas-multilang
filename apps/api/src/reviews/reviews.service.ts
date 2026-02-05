import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async listByExchange(slug: string) {
    const exchange = await this.prisma.exchange.findUnique({ where: { slug } });
    if (!exchange) return [];
    return this.prisma.review.findMany({ where: { exchangeId: exchange.id }, include: { user: true } });
  }

  async createReview(data: { userId: string; slug: string; rating: number; comment: string }) {
    const exchange = await this.prisma.exchange.findUnique({ where: { slug: data.slug } });
    if (!exchange) throw new Error('Exchange not found');
    return this.prisma.review.create({
      data: {
        userId: data.userId,
        exchangeId: exchange.id,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }
}