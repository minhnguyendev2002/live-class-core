import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Class from '../../../../../libs/common-core/src/entities/Class.entity';
import ClassController from './Class.controller';
import { ClassService } from '@app/common-core/providers/Class.service';

@Module({
  imports: [TypeOrmModule.forFeature([Class])],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {
}