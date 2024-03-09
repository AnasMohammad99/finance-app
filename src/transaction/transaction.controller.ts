import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransActionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from 'src/jwtAuthGuard';
import { RoleGuard } from 'src/roleAuthGuard';
@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}
  //---------------------------------------------------
  @Post()
  makeTransaction(@Body() dto: CreateTransActionDto, @Req() request) {
    return this.transactionService.makeTransaction(dto, request);
  }
  //---------------------------------------------------
  @Get('mytransactions')
  getMyTransactions(
    @Query() query: { limit: string; page: string; date_time: string },
    @Req() request,
  ) {
    return this.transactionService.getMyTransactions(query, request);
  }
  //---------------------------------------------------
  @UseGuards(RoleGuard)
  @Get()
  getAllTransactions(
    @Query() query: { limit: string; page: string; date_time: string },
  ) {
    return this.transactionService.getAllTransactions(query);
  }
  //---------------------------------------------------
  @Get('summry/mysummry')
  getMySummry(@Query() query: { from: string; to: string }, @Req() request) {
    return this.transactionService.getMySummry(request, query);
  }
  //---------------------------------------------------
  @UseGuards(RoleGuard)
  @Get('summry/:account_id')
  getSummry(
    @Query() query: { from: string; to: string },
    @Param('account_id') account_id: string,
  ) {
    return this.transactionService.getSummry(+account_id, query);
  }
}
