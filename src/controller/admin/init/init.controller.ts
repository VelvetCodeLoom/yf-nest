import {
  Body,
  Controller,
  HttpException,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { InitDto } from 'src/types/init.dto';
import { InitProvider } from 'src/provider/init/init.provider';
import { ApiToken } from 'src/provider/swagger/token';

@ApiTags('init')
@ApiToken
@Controller('/api/admin')
export class InitController {
  constructor(private readonly initProvider: InitProvider) {}

  @Post('/init')
  async initSystem(@Body() initDto: InitDto) {
    const hasInit = await this.initProvider.checkHasInited();
    if (hasInit) {
      throw new HttpException('已初始化', 500);
    }

    await this.initProvider.init(initDto);

    return {
      statusCode: 200,
      message: '初始化成功!',
    };
  }
}
