import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { CatsService } from './cats.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './cats.entity';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponseStructure } from 'src/common/interfaces/api-response.interface';

@Controller('cats')
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

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo một con mèo mới' })
  @ApiResponse({ status: 201, description: 'Mèo đã được tạo thành công.', type: Cat })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ.' })
  @ApiBody({ type: CreateCatDto, description: 'Dữ liệu để tạo mèo mới' })
  async create(@Body() createCatDto: CreateCatDto): Promise<ApiResponseStructure<Cat>> {
    const newCat = await this.catsService.create(createCatDto);
    return this.handleResponse(HttpStatus.CREATED, 'Mèo đã được tạo thành công.', newCat);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả mèo' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách mèo.', type: [Cat] })
  async findAll(): Promise<ApiResponseStructure<Cat[]>> {
    const cats = await this.catsService.findAll();
    return this.handleResponse(HttpStatus.OK, 'Lấy danh sách mèo thành công.', cats);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin một con mèo theo ID' })
  @ApiParam({ name: 'id', description: 'ID của mèo', type: Number })
  @ApiResponse({ status: 200, description: 'Trả về thông tin mèo.', type: Cat })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mèo.' })
  async findOne(@Param('id') id: string): Promise<ApiResponseStructure<Cat>> {
    const cat = await this.catsService.findOne(+id);
    return this.handleResponse(HttpStatus.OK, `Lấy thông tin mèo với ID ${id} thành công.`, cat);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin một con mèo' })
  @ApiParam({ name: 'id', description: 'ID của mèo cần cập nhật', type: Number })
  @ApiBody({ type: CreateCatDto, description: 'Dữ liệu cập nhật cho mèo' })
  @ApiResponse({ status: 200, description: 'Mèo đã được cập nhật thành công.', type: Cat })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mèo.' })
  async update(@Param('id') id: string, @Body() updateCatDto: CreateCatDto): Promise<ApiResponseStructure<Cat>> {
    const updatedCat = await this.catsService.update(+id, updateCatDto);
    return this.handleResponse(HttpStatus.OK, `Mèo với ID ${id} đã được cập nhật thành công.`, updatedCat);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa một con mèo' })
  @ApiParam({ name: 'id', description: 'ID của mèo cần xóa', type: Number })
  @ApiResponse({ status: 204, description: 'Mèo đã được xóa thành công.' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy mèo để xóa.' })
  async remove(@Param('id') id: string): Promise<ApiResponseStructure<Cat>> {
    await this.catsService.remove(+id);
    return this.handleResponse(HttpStatus.OK, `Mèo với ID ${id} đã được xóa thành công.`)
  }
}
