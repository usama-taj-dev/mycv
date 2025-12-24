import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

const parser: ({ value }: TransformFnParams) => number = ({ value }) =>
  parseInt(value as string);

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @Transform(parser)
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @Transform(parser)
  @IsNumber()
  @Min(0)
  @Max(100000)
  mileage: number;

  @Transform(parser)
  @IsLongitude()
  lng: number;

  @Transform(parser)
  @IsLatitude()
  lat: number;
}
