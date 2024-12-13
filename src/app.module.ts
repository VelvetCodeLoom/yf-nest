import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/index';
import { User, UserSchema } from './scheme/user.schema';
import { Token, TokenSchema } from './scheme/token.schema';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongoUrl, {
      autoIndex: true,
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
