import { Controller, Get, Param } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly service: OpportunitiesService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.getById(id);
  }
}