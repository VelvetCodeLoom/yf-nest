import { Injectable } from '@nestjs/common';
import { TokenProvider } from '../token/token.provider';

@Injectable()
export class AuthProvider {
  constructor(private readonly tokenProvider: TokenProvider) {}

  async login(user: any) {
    const payload = {
      username: user.name,
      sub: user.id,
      type: (user?._doc || user)?.type || undefined,
      nickname: (user?._doc || user)?.nickname || undefined,
      permissions: (user?._doc || user)?.permissions || undefined,
    };
    if (user._doc) {
      payload.username = user._doc.name;
      payload.sub = user._doc.id;
    }
    const token = await this.tokenProvider.createToken(payload);
    return {
      token,
      user: {
        name: payload.username,
        id: payload.sub,
        type: payload.type,
        nickname: payload.nickname,
        permissions: payload.permissions,
      },
    };
  }
}
