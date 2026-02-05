import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':slug')
  list(@Param('slug') slug: string) {
    return this.reviewsService.listByExchange(slug);
  }

  @Post(':slug')
  create(@Param('slug') slug: string, @Body() body: { rating: number; comment: string }) {
    const userId = 'admin';
    return this.reviewsService.createReview({ userId, slug, rating: body.rating, comment: body.comment });
  }
}