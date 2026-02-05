import { Module } from '@nestjs/common';
import { ScannerService } from './scanner.service';
import { ScannerController } from './scanner.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ScannerGateway } from './scanner.gateway';

@Module({
  imports: [PrismaModule],
  providers: [ScannerService, ScannerGateway],
  controllers: [ScannerController],
})
export class ScannerModule {}