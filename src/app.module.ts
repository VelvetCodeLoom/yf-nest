import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/index';
import { User, UserSchema } from './scheme/user.schema';
import { Token, TokenSchema } from './scheme/token.schema';
import { TokenProvider } from './provider/token/token.provider';
import { SettingProvider } from './provider/setting/setting.provider';
import { Setting, SettingSchema } from './scheme/setting.schema';
import { AuthProvider } from './provider/auth/auth.provider';
import { CacheProvider } from './provider/cache/cache.provider';
import { LogProvider } from './provider/log/log.provider';
import { TokenController } from './controller/admin/token/token.controller';
import { InitProvider } from './provider/init/init.provider';
import { JwtModule } from '@nestjs/jwt';
import { initJwt } from './utils/initJwt';
import { LocalStrategy } from './provider/auth/local.strategy';
import { JwtStrategy } from './provider/auth/jwt.strategy';
import { PersonnelModule } from './personnel/personnel.module';
import { UserProvider } from './provider/user/user.provider';
import { AuthController } from './controller/admin/auth/auth.controller';
@Module({
  imports: [
    MongooseModule.forRoot(config.mongoUrl, {
      autoIndex: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Setting.name, schema: SettingSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: await initJwt(),
          signOptions: {
            expiresIn: 3600 * 24 * 7,
          },
        };
      },
    }),
    PersonnelModule,
  ],
  controllers: [AppController, AuthController, TokenController],
  providers: [
    AppService,
    TokenProvider,
    SettingProvider,
    AuthProvider,
    LogProvider,
    CacheProvider,
    InitProvider,
    LocalStrategy,
    JwtStrategy,
    UserProvider,
  ],
})
export class AppModule {}
