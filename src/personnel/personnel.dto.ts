import { IsString, IsInt, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 创建用户 DTO
export class CreatePersonnelDto {
  @ApiProperty({ description: '用户名', example: 'JohnDoe' })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名是必填项' })
  name: string;

  @ApiProperty({ description: '微信名', example: 'John_WeChat', required: false })
  @IsString({ message: '微信名必须是字符串' })
  @IsOptional()
  weChatName?: string;

  @ApiProperty({ description: '年龄', example: 30, required: false })
  @IsOptional()
  age?: number;

  @ApiProperty({ description: '地址', example: '某街道, 某城市', required: false })
  @IsString({ message: '地址必须是字符串' })
  @IsOptional()
  address?: string;

  @ApiProperty({ description: '电话号码', example: '1234567890', required: false })
  @IsString({ message: '电话号码必须是字符串' })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: '预约日期 (格式: YYYY-MM-DD HH:mm:ss)',
    example: '2024-12-10 14:30:00',
  })
  @IsString({ message: '预约日期必须是有效日期字符串 (例如: 2024-12-10 14:30:00)' })
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '预约日期格式必须为 YYYY-MM-DD HH:mm:ss',
  })
  @IsNotEmpty({ message: '预约日期是必填项' })
  appointmentDate: string;

  @ApiProperty({ description: '是否到达 (0: 否, 1: 是)', example: 0, required: false })
  @IsOptional()
  isArrived?: number;

  @ApiProperty({ description: '是否已转接 (0: 否, 1: 是)', example: 0, required: false })
  @IsOptional()
  isTransferred?: number;

  @ApiProperty({ description: '是否已接收 (0: 否, 1: 是)', example: 0, required: false })
  @IsOptional()
  isReceived?: number;

  @ApiProperty({ description: '领取金额', example: 100, required: false })
  @IsOptional()
  receivedAmount?: number;

  @ApiProperty({ description: '备注', example: '备注信息', required: false })
  @IsOptional()
  remark?: string;
}

// 更新用户 DTO
export class UpdatePersonnelDto {
  @ApiProperty({ description: '用户名', example: 'JohnDoe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '微信名', example: 'John_WeChat', required: false })
  @IsString()
  @IsOptional()
  weChatName?: string;

  @ApiProperty({ description: '年龄', example: 30, required: false })
  @IsOptional()
  age?: number;

  @ApiProperty({ description: '地址', example: '某街道, 某城市', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: '电话号码', example: '1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: '预约日期 (格式: YYYY-MM-DD HH:mm:ss)',
    example: '2024-12-10 14:30:00',
    required: false,
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/, {
    message: '预约日期格式必须为 YYYY-MM-DD HH:mm:ss',
  })
  @IsOptional()
  appointmentDate?: string;

  @ApiProperty({ description: '是否到达 (0: 否, 1: 是)', example: 0, required: false })
  @IsOptional()
  isArrived?: number;

  @ApiProperty({ description: '是否已转接 (0: 否, 1: 是)', example: 0, required: false })
  @IsOptional()
  isTransferred?: number;

  @ApiProperty({ description: '是否已接收 (0: 否, 1: 是)', example: 0, required: false })
  @IsOptional()
  isReceived?: number;

  @ApiProperty({ description: '领取金额', example: 100, required: false })
  @IsOptional()
  receivedAmount?: number;

  @ApiProperty({ description: '用户ID', example: '12345' }) // 为 ID 添加描述
  @IsString({ message: 'id 是必填字段' })
  id: string;

  @ApiProperty({ description: '备注', example: '备注信息', required: false })
  @IsOptional()
  remark?: string;
}
export class FindPersonnelQuery {
  @ApiProperty({ description: '当前页', example: 1 })
  @IsInt()
  page: number;

  @ApiProperty({ description: '每页数量', example: 10 })
  @IsInt()
  limit: number;

  @ApiProperty({ description: '用户名' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: '电话号码' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: '预约日期' })
  @IsOptional()
  @IsString()
  appointmentDate?: string;

  @ApiProperty({ description: '是否到店 (0: 否, 1: 是)', example: 0 })
  @IsOptional()
  isArrived?: number | string;

  @ApiProperty({ description: '是否转账 (0: 否, 1: 是)', example: 0 })
  @IsOptional()
  isTransferred?: number | string;

  @ApiProperty({ description: '是否领取 (0: 否, 1: 是)', example: 0 })
  @IsOptional()
  isReceived?: number | string;
}
