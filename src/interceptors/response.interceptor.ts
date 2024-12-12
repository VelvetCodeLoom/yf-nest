import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // 动态生成默认消息
    const defaultMessage =
      {
        GET: '获取成功',
        POST: '创建成功',
        PUT: '更新成功',
        PATCH: '部分更新成功',
        DELETE: '删除成功',
      }[request.method] || '操作成功';

    return next.handle().pipe(
      map((data) => {
        // 如果 data 是对象并且没有 code 和 msg，使用默认值
        const response = { ...data };

        // 如果返回的数据已经有 code 和 msg，直接返回
        if (response.code && response.msg) {
          return response;
        }

        // 如果没有自定义的 code 和 msg，使用默认值
        if (!response.code) {
          response.code = 200; // 默认为 200
        }
        if (!response.msg) {
          response.msg = defaultMessage; // 使用默认消息
        }

        // 保留原始数据结构
        response.data = data?.data || data; // 保留原始数据

        return response;
      }),
    );
  }
}
