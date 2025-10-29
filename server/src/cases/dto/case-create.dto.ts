import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class CaseCreateDto {
  @IsString()
  caseId: string;

  @IsString()
  image: string;

  @IsString()
  name: string;

  @IsNumberString()
  @IsNotEmpty({ message: 'You need to set a price' })
  price: number;
}
