import { Controller, Get, Param, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ScannerService } from './scanner.service';
import { ScannerGateway } from './scanner.gateway';

@Controller('scanner')
export class ScannerController {
  constructor(
    private readonly scannerService: ScannerService,
    private readonly gateway: ScannerGateway,
  ) {}

  @Get('cex')
  getCex() {
    return this.scannerService.getCexOpportunities();
  }

  @Get('tri')
  getTri() {
    return this.scannerService.getTriOpportunities();
  }

  @Get('p2p')
  getP2P() {
    return this.scannerService.getP2POpportunities();
  }

  @Sse('events/:type')
  sse(@Param('type') type: string): Observable<any> {
    return this.gateway.getStream(type).pipe(
      map((data) => ({ data })),
    );
  }
}