import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';

import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import { AuthGuard } from '../auth/auth.guard';
import {
  BulkCategorySchema,
  BulkDeleteSchema,
  BulkStatusSchema,
  SearchParamsSchema,
  TransactionCreateSchema,
  TransactionUpdateSchema,
  type BulkCategoryDto,
  type BulkDeleteDto,
  type BulkStatusDto,
  type SearchParamsDto,
  type TransactionCreateDto,
  type TransactionUpdateDto,
} from './schemas/transactions.schemas';
import { TransactionsService } from './transactions.service';

@Controller('api/dashboard/transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  private getUserId(req: Request): string {
    const user = req.user as { id?: string; sub?: string } | undefined;
    return user?.id ?? user?.sub ?? '';
  }

  @Get()
  async list(
    @Req() req: Request,
    @Query(new ZodValidationPipe(SearchParamsSchema)) params: SearchParamsDto,
  ) {
    return this.transactionsService.findByUserId(this.getUserId(req), params);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(TransactionCreateSchema))
  async create(@Req() req: Request, @Body() dto: TransactionCreateDto) {
    return this.transactionsService.create(this.getUserId(req), dto);
  }

  // Bulk routes go BEFORE :id so they aren't shadowed by the catch-all
  @Delete('all')
  async deleteAll(@Req() req: Request) {
    return this.transactionsService.deleteAll(this.getUserId(req));
  }

  @Delete()
  @UsePipes(new ZodValidationPipe(BulkDeleteSchema))
  async deleteMany(@Req() req: Request, @Body() dto: BulkDeleteDto) {
    return this.transactionsService.deleteMany(this.getUserId(req), dto);
  }

  @Patch('status')
  @UsePipes(new ZodValidationPipe(BulkStatusSchema))
  async updateStatusMany(@Req() req: Request, @Body() dto: BulkStatusDto) {
    return this.transactionsService.updateStatusMany(this.getUserId(req), dto);
  }

  @Patch('category')
  @UsePipes(new ZodValidationPipe(BulkCategorySchema))
  async updateCategoryMany(@Req() req: Request, @Body() dto: BulkCategoryDto) {
    return this.transactionsService.updateCategoryMany(
      this.getUserId(req),
      dto,
    );
  }

  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') id: string) {
    const found = await this.transactionsService.findById(
      id,
      this.getUserId(req),
    );
    if (!found) throw new NotFoundException('Transaction not found');
    return found;
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(TransactionUpdateSchema))
    dto: TransactionUpdateDto,
  ) {
    const updated = await this.transactionsService.update(
      id,
      this.getUserId(req),
      dto,
    );
    if (!updated) throw new NotFoundException('Transaction not found');
    return updated;
  }

  @Delete(':id')
  async deleteOne(@Req() req: Request, @Param('id') id: string) {
    return this.transactionsService.deleteById(id, this.getUserId(req));
  }
}
