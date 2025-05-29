import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CatsService } from './cats.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './cats.entity';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponseStructure } from 'src/common/interfaces/api-response.interface';

@ApiTags('Cats controller')
@Controller('api/cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) { }
  private handleResponse<T>(
    statusCode: HttpStatus,
    message: string,
    data?: T,
  ): ApiResponseStructure<T> {
    return {
      code: statusCode,
      message: message,
      data: data,
    };
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCatDto: CreateCatDto): Promise<ApiResponseStructure<Cat>> {
    const newCat = await this.catsService.create(createCatDto);
    return this.handleResponse(HttpStatus.CREATED, 'Mèo đã được tạo thành công.', newCat);
  }

  @Get('search/:id')
  async findOne(@Param('id') id: string): Promise<ApiResponseStructure<Cat>> {
    const cat = await this.catsService.findOne(+id);
    return this.handleResponse(HttpStatus.OK, `Lấy thông tin mèo với ID ${id} thành công.`, cat);
  }

  @Put('edit/:id')
  async update(@Param('id') id: string, @Body() updateCatDto: CreateCatDto): Promise<ApiResponseStructure<Cat>> {
    const updatedCat = await this.catsService.update(+id, updateCatDto);
    return this.handleResponse(HttpStatus.OK, `Mèo với ID ${id} đã được cập nhật thành công.`, updatedCat);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string): Promise<ApiResponseStructure<Cat>> {
    await this.catsService.remove(+id);
    return this.handleResponse(HttpStatus.OK, `Mèo với ID ${id} đã được xóa thành công.`)
  }
}
