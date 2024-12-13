import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ timestamps: true })
export class Register extends Document {
  @Prop({ required: true, description: '用户名' })
  name: string;

  @Prop({ required: true, description: '加密密码' })
  password: string;

  @Prop({ required: true, description: '盐值' })
  salt: string;
}

export const RegisterSchema = SchemaFactory.createForClass(Register);
