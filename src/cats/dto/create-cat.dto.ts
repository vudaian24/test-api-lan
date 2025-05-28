import { IsString, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({ description: 'Tên của mèo', example: 'Mèo Con' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Tuổi của mèo', example: 3 })
  @IsInt()
  age: number;

  @ApiProperty({ description: 'Giống mèo', example: 'Xiêm', required: false })
  @IsString()
  @MinLength(1)
  breed?: string;
}
