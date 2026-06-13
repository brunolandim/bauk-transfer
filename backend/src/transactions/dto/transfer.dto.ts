import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';

export class TransferDto {
  @IsString()
  @MinLength(3)
  creditedUsername: string;

  @IsNumber()
  @IsPositive()
  value: number;
}
