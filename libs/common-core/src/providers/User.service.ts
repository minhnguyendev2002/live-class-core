import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import User from '@app/common-core/entities/User.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
  }

  async create(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne({ id: id });
  }
}