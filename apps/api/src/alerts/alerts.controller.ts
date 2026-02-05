import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { OpportunityType } from '@prisma/client';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  create(@Body() body: { type: OpportunityType; threshold: number; params?: any }) {
    // In a real app you would extract user id from auth token
    const userId = 'admin';
    return this.alertsService.createAlert({ userId, type: body.type, threshold: body.threshold, params: body.params || {} });
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.alertsService.findAllByUser(userId);
  }
}