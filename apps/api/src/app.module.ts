import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { ScannerModule } from './scanner/scanner.module';
import { AlertsModule } from './alerts/alerts.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MetricsModule } from './metrics/metrics.module';
import { OpportunitiesModule } from './opportunities/opportunities.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 100,
    }),
    PrismaModule,
    ExchangesModule,
    ScannerModule,
    AlertsModule,
    ReviewsModule,
    MetricsModule,
    AuthModule,
    OpportunitiesModule,
  ],
})
export class AppModule {}