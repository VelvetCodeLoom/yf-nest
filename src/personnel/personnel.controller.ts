import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  HttpCode,
  Res,
  UseGuards,
} from '@nestjs/common';
import moment from 'moment';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import * as XLSX from 'xlsx';
import { Response } from 'express';
import { PersonnelService } from './personnel.service';
import { CreatePersonnelDto, UpdatePersonnelDto, FindPersonnelQuery } from './personnel.dto';
import { ApiToken } from 'src/provider/swagger/token';
import { AdminGuard } from 'src/provider/auth/auth.guard';
@ApiTags('personnel')
@Controller('personnel')
@UseGuards(...AdminGuard)
@ApiToken
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}
  @Post('add')
  @HttpCode(200)
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreatePersonnelDto) {
    await this.personnelService.create(createUserDto);

    // 在 Controller 层处理自定义响应
    return {
      code: 200,
      msg: '用户已创建成功',
    };
  }
  @Post('list')
  @HttpCode(200)
  @ApiOperation({ summary: '获取所有用户' })
  async findAll(@Body() query: FindPersonnelQuery) {
    const {
      page = 1,
      limit = 10,
      name,
      weChatName,
      phone,
      appointmentDate,
      isArrived,
      isTransferred,
      isReceived,
    } = query;

    // 构建查询条件
    const filter: any = {};

    if (name) {
      filter.name = new RegExp(name, 'i'); // 模糊查询
    }
    if (weChatName) {
      filter.weChatName = new RegExp(weChatName, 'i'); // 模糊查询
    }

    if (phone) {
      filter.phone = phone;
    }
    if (appointmentDate) {
      // 检查是否包含时分秒
      const momentDate = moment(appointmentDate, 'YYYY-MM-DD HH:mm:ss', true); // true表示严格匹配
      if (momentDate.isValid() && momentDate.hours() !== 0) {
        // 如果包含时分秒，直接使用 appointmentDate
        filter.appointmentDate = {
          $gte: momentDate.format('YYYY-MM-DD HH:mm:ss'),
          $lte: momentDate.format('YYYY-MM-DD HH:mm:ss'),
        };
      } else {
        // 如果没有时分秒，按照你的逻辑查找当天的起始和结束时间
        const startOfDay = moment(appointmentDate).startOf('day').format('YYYY-MM-DD HH:mm:ss');
        const endOfDay = moment(appointmentDate).endOf('day').format('YYYY-MM-DD HH:mm:ss');
        filter.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
      }
    }

    if (isArrived) {
      filter.isArrived = isArrived;
    } else if (isArrived === 0) {
      filter.isArrived = isArrived;
    }
    if (isTransferred) {
      filter.isTransferred = isTransferred;
    } else if (isTransferred === 0) {
      filter.isTransferred = isTransferred;
    }
    if (isReceived) {
      filter.isReceived = isReceived;
    } else if (isReceived === 0) {
      filter.isReceived = isReceived;
    }

    const users = await this.personnelService.findAll(page, limit, filter);

    const total = await this.personnelService.countUsers(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      code: 200,
      msg: '获取用户列表成功',
      data: {
        records: users,
        currentPage: page,
        totalPages: totalPages,
        total,
        limit,
      },
    };
  }
  // 更新用户
  @Post('update')
  @ApiOperation({ summary: '批量更新用户' })
  async updateBatch(@Body() UpdateUserDto: UpdatePersonnelDto) {
    const updatedUsers = await this.personnelService.updateUser(UpdateUserDto);

    // 返回自定义响应格式
    return {
      code: 200, // 操作成功的状态码
      msg: '用户更新成功', // 自定义消息
      data: updatedUsers, // 返回更新后的用户数据
    };
  }

  @Delete('delete')
  @ApiOperation({ summary: '根据 id 删除用户' })
  async remove(@Query('id') id: string) {
    // 调用服务层的删除方法，获取删除的用户信息
    const deletedUser = await this.personnelService.remove(id);

    // 返回自定义响应结构
    return {
      code: 200, // 成功的状态码
      msg: `用户 ${deletedUser.name} 删除成功`, // 自定义消息，用户的姓名
    };
  }

  // 导出用户列表功能
  @Post('export')
  @ApiOperation({ summary: '导出用户列表' })
  async exportUsers(
    @Res() res: Response,
    @Body() body: { name?: string; phone?: string; appointmentDate?: string; isArrived?: string },
  ) {
    const filter: any = {};

    // 判断字段是否为非空字符串，添加到查询条件
    if (body.name && body.name.trim() !== '') {
      filter.name = new RegExp(body.name.trim(), 'i'); // 模糊查询
    }
    if (body.phone && body.phone.trim() !== '') {
      filter.phone = body.phone.trim();
    }
    if (body.appointmentDate && body.appointmentDate.trim() !== '') {
      filter.appointmentDate = body.appointmentDate.trim();
    }
    if (body.isArrived && body.isArrived.trim() !== '') {
      filter.isArrived = Number(body.isArrived.trim()); // 转为数字类型
    }

    // 查询符合条件的用户；如果 filter 为空，则查询所有
    const users = await this.personnelService.findAll(1, 10000, filter);

    // 调用服务层的 extractFieldDescriptions 方法获取字段描述
    const fieldMap = this.personnelService.extractFieldDescriptions();

    // 准备导出数据
    const data = users.map((user) => {
      const userData: any = {};
      for (const key in fieldMap) {
        if (fieldMap.hasOwnProperty(key)) {
          let value = user[key];
          // 处理特定字段的格式化
          if (key === 'isArrived' || key === 'isTransferred' || key === 'isReceived') {
            value = value ? '是' : '否';
          } else if (key === 'receivedAmount') {
            value = value || '未领取'; // 如果领取金额为空，显示 '未领取'
          } else if (value === null || value === undefined) {
            value = '未提供'; // 如果字段为空，显示 '未提供'
          }
          // 将值赋给对应的中文字段名
          userData[fieldMap[key]] = value;
        }
      }
      return userData;
    });

    // 创建 Excel 表格
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '用户信息');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    // 设置响应头，告知客户端下载文件
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURIComponent('用户信息')}.xlsx`,
    );

    res.send(buffer);
  }
}
