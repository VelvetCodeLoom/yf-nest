import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { version } from '../../utils/loadConfig';
import { encryptPassword, makeSalt } from 'src/utils/crypto';
import { UserDocument } from 'src/scheme/user.schema';
import { InitDto } from 'src/types/init.dto';
import { CacheProvider } from '../cache/cache.provider';
import { SettingProvider } from '../setting/setting.provider';
import fs from 'fs';
import path from 'path';
@Injectable()
export class InitProvider {
  logger = new Logger(InitProvider.name);
  constructor(
    private readonly cacheProvider: CacheProvider,
    private readonly settingProvider: SettingProvider,
    @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}
  async init(initDto: InitDto) {
    const { user } = initDto;
    try {
      const salt = makeSalt();
      await this.userModel.create({
        id: 0,
        name: user.username,
        password: encryptPassword(user.username, user.password, salt),
        mickname: user?.nickname || user.username,
        type: 'admin',
        salt,
      });

      return '初始化成功!';
    } catch (err) {
      throw new BadRequestException('初始化失败');
    }
  }
  async initRestoreKey() {
    const key = makeSalt();
    await this.cacheProvider.set('restoreKey', key);
    const filePath = path.join('/var/log/', 'restore.key');
    try {
      fs.writeFileSync(filePath, key, { encoding: 'utf-8' });
    } catch (err) {
      this.logger.error('写入恢复密钥到文件失败！');
    }
    this.logger.warn(
      `忘记密码恢复密钥为： ${key}\n 注意此密钥也会同时写入到日志目录中的 restore.key 文件中，每次重启 服务 或老密钥被使用时都会重新生成此密钥`,
    );
  }
  async checkHasInited() {
    const user = await this.userModel.findOne({}).exec();
    if (!user) {
      return false;
    }
    return true;
  }
  async initVersion() {
    if (!version || version == 'dev') {
      this.logger.debug('开发版本');
      return;
    }
    try {
      const versionSetting = await this.settingProvider.getVersionSetting();
      if (!versionSetting || !versionSetting?.version) {
        // 没有版本信息，加进去
        await this.settingProvider.updateVersionSetting({
          version: version,
        });
      } else {
        // TODO 后面这里会判断版本执行一些版本迁移的数据清洗脚本
        await this.settingProvider.updateVersionSetting({
          version,
        });
      }
    } catch (err) {
      this.logger.error(`初始化版本信息失败: ${JSON.stringify(err, null, 2)}`);
    }
  }
}
