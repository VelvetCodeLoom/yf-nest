import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginSetting, VersionSetting } from 'src/types/setting.dto';
import { SettingDocument } from 'src/scheme/setting.schema';
import { encode } from 'js-base64';

@Injectable()
export class SettingProvider {
  logger = new Logger(SettingProvider.name);
  constructor(
    @InjectModel('Setting')
    private settingModel: Model<SettingDocument>,
  ) {}

  async getLoginSetting(): Promise<LoginSetting> {
    const res = await this.settingModel.findOne({ type: 'login' }).exec();
    if (res) {
      return (
        (res?.value as any) || {
          enableMaxLoginRetry: false,
          maxRetryTimes: 3,
          durationSeconds: 60,
          expiresIn: 3600 * 24 * 7,
        }
      );
    }
    return null;
  }
  async getVersionSetting(): Promise<any> {
    const res = await this.settingModel.findOne({ type: 'version' }).exec();
    if (res) {
      return res?.value;
    }
    return null;
  }
  async updateVersionSetting(dto: VersionSetting) {
    const oldValue = await this.getVersionSetting();
    const newValue = { ...oldValue, ...dto };
    if (!oldValue) {
      return await this.settingModel.create({
        type: 'version',
        value: newValue,
      });
    }
    const res = await this.settingModel.updateOne({ type: 'version' }, { value: newValue });
    return res;
  }
}
