// personnel.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonnelService } from './personnel.service';
import { PersonnelController } from './personnel.controller';
import { Personnel, PersonnelSchema } from '../scheme/personnel.schema'; // 根据你的实际路径调整

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Personnel.name, schema: PersonnelSchema }]), // 确保模型注册
  ],
  controllers: [PersonnelController],
  providers: [PersonnelService], // 确保服务提供
})
export class PersonnelModule {}
