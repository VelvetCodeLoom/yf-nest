import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type TokenDocument = Token & Document;

@Schema()
export class Token extends Document {
  @Prop({ index: true, description: '用户ID' })
  userId: number;

  @Prop({ index: true, description: '令牌值' })
  token: string;

  @Prop({ index: true, required: false, description: '令牌名称' })
  name?: string;

  @Prop({ description: '过期时间，以秒为单位' })
  expiresIn: number;

  @Prop({
    index: true,
    default: () => new Date(),
    description: '创建时间',
  })
  createdAt: Date;

  @Prop({ default: false, index: true, description: '是否禁用' })
  disabled: boolean;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
