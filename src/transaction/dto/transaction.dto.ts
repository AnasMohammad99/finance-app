import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
// export enum transactionType {
//   SENDER,
//   RECIVER,
// }
export class CreateTransActionDto {
  @IsString()
  @IsOptional()
  notes: string;
  @IsNumber()
  @IsNotEmpty()
  amount: number;
  @IsNumber()
  @IsNotEmpty()
  reciver_id: number;
  // @IsNotEmpty()
  // @IsEnum(transactionType)
  // transaction_type: any;
}
