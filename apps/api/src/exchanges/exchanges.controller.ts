import { Controller, Get, Param } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';

@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) {}

  @Get()
  getAll() {
    return this.exchangesService.findAll();
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.exchangesService.findOne(slug);
  }
}