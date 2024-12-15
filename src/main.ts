import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggerService } from './utils/logger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config as globalConfig } from './config/index';
import { checkOrCreate } from './utils/checkFolder';
import * as path from 'path';
import { json } from 'express';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { InitProvider } from './provider/init/init.provider';
import { UserProvider } from './provider/user/user.provider';
import { initJwt } from './utils/initJwt';
async function bootstrap() {
  const jwtSecret = await initJwt();
  global.jwtSecret = jwtSecret;
  const port = 3000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '50mb' }));

  app.useStaticAssets(globalConfig.staticPath, {
    prefix: '/static/',
  });
  // 查看文件夹是否存在 并创建.
  checkOrCreate(globalConfig.codeRunnerPath);
  checkOrCreate(globalConfig.staticPath);
  checkOrCreate(path.join(globalConfig.staticPath, 'img'));
  checkOrCreate(path.join(globalConfig.staticPath, 'tmp'));
  checkOrCreate(path.join(globalConfig.staticPath, 'export'));

  const config = new DocumentBuilder()
    .setTitle('蒙牛 API 文档')
    .setDescription('API Token 请在后台设置页面获取，请添加到请求头的 token 字段中进行鉴权。')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  // 设置全局校验管道
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // 自动剔除 DTO 中未声明的字段
  //     forbidNonWhitelisted: true, // 如果传入未声明的字段，则抛出错误
  //     transform: true, // 自动转换类型
  //     exceptionFactory: (errors) => {
  //       return new BadRequestException(
  //         errors.map((e) => `${e.property}: ${Object.values(e.constraints).join(', ')}`).join('; '),
  //       );
  //     },
  //   }),
  // );

  // 设置全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 注册全局响应拦截器
  app.useGlobalInterceptors(new ResponseInterceptor());
  await app.listen(port);
  const initProvider = app.get(InitProvider);
  initProvider.initVersion();
  initProvider.initRestoreKey();

  const userProvider = app.get(UserProvider);
  // 老版本没加盐的用户数据洗一下。
  userProvider.washUserWithSalt();
  // 启动日志
  setTimeout(() => {
    LoggerService.log('appStart', {
      port: 3000,
      appName: 'NestJS 应用已成功启动!',
      extraAddresses: [
        { name: '主站', url: `http://localhost:${port}`, icon: '🏠' },
        { name: 'Swagger 文档', url: `http://localhost:${port}/swagger`, icon: '📄' },
      ],
    });
  }, 3000);
}

bootstrap();
