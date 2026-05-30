import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TransactionsController],
  providers: [TransactionsService],
})
export class TransactionsModule {}
