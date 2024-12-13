import { AuthGuard } from '@nestjs/passport';
import { TokenGuard } from './token.guard';

export const AdminGuard = [AuthGuard('jwt'), TokenGuard];
