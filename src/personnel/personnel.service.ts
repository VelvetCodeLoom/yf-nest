import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Personnel } from '../scheme/personnel.schema';
import { CreatePersonnelDto, UpdatePersonnelDto } from './personnel.dto';
import moment from 'moment';
import { makeSalt, encryptPassword } from 'src/utils/crypto';
@Injectable()
export class PersonnelService {
  constructor(@InjectModel(Personnel.name) private userModel: Model<Personnel>) {}
  /**
   *  * 提取表中的字段中的描述信息-给导出excel使用
   * @returns
   * */
  extractFieldDescriptions() {
    const fieldMap: Record<string, string> = {};
    const schemaDefinition = this.userModel.schema.obj; // 获取 schema 定义

    for (const key in schemaDefinition) {
      if (schemaDefinition[key].description) {
        fieldMap[key] = schemaDefinition[key].description;
      }
    }

    return fieldMap;
  }

  // 创建用户方法
  async create(createUserDto: CreatePersonnelDto): Promise<Personnel> {
    try {
      // 解析并验证预约日期的格式
      const parsedDate = new Date(createUserDto.appointmentDate);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('预约日期格式无效，请使用正确的日期格式');
      }

      // 格式化日期为字符串格式（例如：'YYYY-MM-DD HH:mm:ss'）
      const formattedDate = moment(parsedDate).format('YYYY-MM-DD HH:mm:ss');

      // 如果没有传递 isArrived，则默认设置为 0
      const { isArrived = 0 } = createUserDto;

      // 创建新用户并保存到数据库
      const newUser = new this.userModel({
        ...createUserDto,
        appointmentDate: formattedDate, // 保存格式化后的字符串日期
        isArrived, // 设置是否到店的字段
      });

      return await newUser.save();
    } catch (error) {
      throw new BadRequestException('创建用户失败，请检查输入内容');
    }
  }

  // 查询所有用户并返回格式化后的日期
  async findAll(page: number = 1, limit: number = 10, filter: any = {}): Promise<Personnel[]> {
    const skip = (page - 1) * limit;
    const users = await this.userModel
      .find(filter) // 根据筛选条件查询
      .skip(skip)
      .limit(limit)
      .exec();

    // 格式化查询结果中的 appointmentDate 字段
    return users.map((user) => {
      if (user.appointmentDate) {
        user.appointmentDate = moment(user.appointmentDate).format('YYYY-MM-DD HH:mm:ss'); // 格式化为字符串
      }
      return user;
    });
  }

  async countUsers(filter: any = {}): Promise<number> {
    return this.userModel.countDocuments(filter).exec();
  }

  // 更新用户方法
  async updateUser(updateUserDto: UpdatePersonnelDto): Promise<Personnel> {
    const { id, ...updateData } = updateUserDto; // 分离 id 和其他更新字段

    // 如果没有提供 isArrived，默认值为 0
    if (updateData.isArrived === undefined) {
      updateData.isArrived = 0;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`用户 ID ${id} 未找到`);
    }

    // 格式化 appointmentDate 字段
    if (updatedUser.appointmentDate) {
      updatedUser.appointmentDate = moment(updatedUser.appointmentDate).format(
        'YYYY-MM-DD HH:mm:ss',
      ); // 格式化为 'YYYY-MM-DD HH:mm:ss'
    }
    return updatedUser;
  }

  // 删除用户方法
  async remove(id: string): Promise<{ name: string }> {
    // 执行删除操作
    const result = await this.userModel.findByIdAndDelete(id).exec();

    // 如果未找到用户，则抛出异常
    if (!result) {
      throw new NotFoundException(`用户 ID ${id} 未找到`);
    }

    // 返回被删除的用户信息，通常返回姓名或其他标识符
    return { name: result.name };
  }
}
