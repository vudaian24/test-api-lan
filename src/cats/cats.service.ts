import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './cats.entity';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat) private readonly catsRepository: Repository<Cat>,
  ) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const newCat = this.catsRepository.create(createCatDto);
    return this.catsRepository.save(newCat);
  }

  async findAll(): Promise<Cat[]> {
    return this.catsRepository.find();
  }

  async findOne(id: number): Promise<Cat> {
    const cat = await this.catsRepository.findOne({ where: { id } });
    if (!cat) {
      throw new NotFoundException(`Mèo với ID "${id}" không tìm thấy.`);
    }
    return cat;
  }

  async update(id: number, updateCatDto: CreateCatDto): Promise<Cat> {
    const cat = await this.findOne(id);
    Object.assign(cat, updateCatDto);
    return this.catsRepository.save(cat);
  }

  async remove(id: number): Promise<void> {
    const result = await this.catsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Mèo với ID "${id}" không tìm thấy để xóa.`);
    }
  }
}
