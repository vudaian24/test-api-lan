import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
@ApiTags('user-controller')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create-2')
  @ApiOperation({description:'Tạo một con mèo mới' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('get-list')
  findAll() {
    return this.userService.findAll();
  }

  @Get('search/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('edit/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete-2/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  
}



