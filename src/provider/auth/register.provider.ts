import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Register } from 'src/scheme/register.schema';

@Injectable()
export class RegisterProvider {
  constructor(@InjectModel(Register.name) private readonly userModel: Model<Register>) {}

  async findByUsername(username: string): Promise<Register | null> {
    return this.userModel.findOne({ name: username }).exec();
  }

  async createUser(userData: { username: string; password: string; salt: string }) {
    const newUser = new this.userModel({
      name: userData.username,
      password: userData.password,
      salt: userData.salt,
    });
    return newUser.save();
  }
}
