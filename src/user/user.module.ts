import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from '../scheme/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), // 注册模型
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // 如果其他模块需要使用 UserService，可以导出
})
export class UserModule {}
