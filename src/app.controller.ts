import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('controller')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  @Get('greet/:name')
  getGreet(@Param('name') name: string) {
    return { greeting: `Hello v3, ${name}!` };
  }

  @Get('sum')
  getSum(@Query('a') a: string, @Query('b') b: string) {
    const numA = Number(a);
    const numB = Number(b);
    if (isNaN(numA) || isNaN(numB)) {
      return { error: 'Invalid numbers' };
    }
    return { sum: numA + numB };
  }
}
