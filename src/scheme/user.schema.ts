import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, description: '姓名' })
  name: string;

  @Prop({ required: false, description: '微信名' })
  weChatName: string; // 微信名

  @Prop({ required: false, description: '年龄' })
  age: number;

  @Prop({ required: false, description: '地址' })
  address: string;

  @Prop({ required: false, description: '电话' })
  phone: string;

  // 日期信息
  @Prop({ required: true, description: '预约日期' })
  appointmentDate: string;

  // 状态字段
  @Prop({ type: Number, enum: [0, 1], default: 0, description: '是否到店' })
  isArrived: number; // 0: 否, 1: 是

  @Prop({ type: Number, enum: [0, 1], default: 0, description: '是否转账' })
  isTransferred: number; // 0: 否, 1: 是

  @Prop({ type: Number, enum: [0, 1], default: 0, description: '是否领取' })
  isReceived: number; // 0: 否, 1: 是

  @Prop({ type: Number, default: null, description: '领取金额' })
  receivedAmount: number | null; // 领取金额
}

export const UserSchema = SchemaFactory.createForClass(User);
