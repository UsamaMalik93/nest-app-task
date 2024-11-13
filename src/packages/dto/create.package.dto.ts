import { Optional } from '@nestjs/common';
import { IsString, IsArray,IsNotEmpty } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Optional()
  description: string;

  @IsArray()
  @IsString({ each: true }) // services name in string
  services: string[];  // This will accept an array of service names in string
}
