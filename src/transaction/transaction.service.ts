import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTransActionDto } from './dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(private database: DatabaseService) {}
  async makeTransaction(dto: CreateTransActionDto, request) {
    try {
      const sender = await this.database.user.update({
        where: {
          id: request.user.user_id,
        },
        data: {
          balance: {
            decrement: dto.amount,
          },
        },
      });
      if (sender.balance < 0) {
        await this.database.user.update({
          where: {
            id: request.user.user_id,
          },
          data: {
            balance: {
              increment: dto.amount,
            },
          },
        });
        throw new HttpException(
          "you don't have enough blance to make this transaction",
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.database.user.update({
        where: {
          id: dto.reciver_id,
        },
        data: {
          balance: {
            increment: dto.amount,
          },
        },
      });
      const transaction = await this.database.transaction.create({
        data: {
          sender_id: request.user.user_id,
          reciver_id: dto.reciver_id,
          amount: dto.amount,
          notes: dto.notes,
        },
      });
      return { transaction, message: 'transaction created' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  //----------------------------------------------------------
  async getMyTransactions(
    query: {
      limit: string;
      page: string;
      date_time: string;
    },
    request,
  ) {
    try {
      if (query.date_time === undefined) {
        query.date_time = '2000-01-01';
      }

      const page = Number(+query.page) || 1;
      const limit = Number(+query.limit) || 10;
      const skip = (page - 1) * limit;
      const transactions = await this.database.transaction.findMany({
        where: {
          // sender_id: request.user.user_id,
          OR: [
            {
              sender_id: request.user.user_id,
            },
            {
              reciver_id: request.user.user_id,
            },
          ],
          created_at: {
            gte: new Date(query.date_time),
            // lte: new Date(query.data_time),
          },
        },
        skip,
        take: limit,
      });
      return { data: transactions };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //----------------------------------------------------------
  async getAllTransactions(query: {
    limit: string;
    page: string;
    date_time: string;
  }) {
    try {
      if (query.date_time === undefined) {
        query.date_time = '2000-01-01';
      }
      const page = Number(+query.page) || 1;
      const limit = Number(+query.limit) || 10;
      const skip = (page - 1) * limit;
      const transactions = await this.database.transaction.findMany({
        where: {
          created_at: {
            gte: new Date(query.date_time),
          },
        },
        skip,
        take: limit,
      });
      return { data: transactions };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  //----------------------------------------------------------
  async getMySummry(
    request,
    query: {
      from: string;
      to: string;
    },
  ) {
    if (query.from === undefined) {
      query.from = '2000-01-01';
    }
    if (query.to === undefined) {
      query.to = '2030-12-31';
    }
    let total_incomes = 0;
    let total_expenses = 0;
    const account = await this.database.user.findUnique({
      where: {
        id: request.user.user_id,
      },
      select: {
        sends: true,
        recives: true,
        balance: true,
      },
    });
    account.sends.map(
      (transaction) => (total_expenses = total_expenses + transaction.amount),
    );
    account.recives.map(
      (transaction) => (total_incomes = total_incomes + transaction.amount),
    );
    return {
      summry: { total_incomes, total_expenses, total_balance: account.balance },
    };
  }
  //----------------------------------------------------------
  async getSummry(
    account_id: number,
    query: {
      from: string;
      to: string;
    },
  ) {
    if (query.from === undefined) {
      query.from = '2000-01-01';
    }
    if (query.to === undefined) {
      query.to = '2030-12-31';
    }
    let total_incomes = 0;
    let total_expenses = 0;
    const account = await this.database.user.findUnique({
      where: {
        id: account_id,
      },
      select: {
        sends: true,
        recives: true,
        balance: true,
      },
    });
    account.sends.map(
      (transaction) => (total_expenses = total_expenses + transaction.amount),
    );
    account.recives.map(
      (transaction) => (total_incomes = total_incomes + transaction.amount),
    );
    return {
      summry: { total_incomes, total_expenses, total_balance: account.balance },
    };
  }
}
