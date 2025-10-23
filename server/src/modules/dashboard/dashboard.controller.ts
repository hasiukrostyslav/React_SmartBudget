import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('dashboard')
export class DashboardController {
  @Get()
  @UseGuards(AuthGuard)
  getDashboard() {
    return 'Dashboard Page';
  }
}
