import { Logger } from '@nestjs/common';
import chalk from 'chalk';

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'appStart';

interface AddressDetail {
  name: string;
  url: string;
  icon?: string; // 可选字段，用于配置图标
}

interface LogDetails {
  message?: string;
  port?: number;
  appName?: string;
  extraAddresses?: AddressDetail[]; // 用于自定义名称、URL 和图标的数组
}

class LoggerService {
  private static getLogFormatter(type: LogLevel): (message: string | LogDetails) => string {
    switch (type) {
      case 'info':
        return (message: string) => chalk.blue(message);
      case 'warn':
        return (message: string) => chalk.yellow(message);
      case 'error':
        return (message: string) => chalk.red(message);
      case 'debug':
        return (message: string) => chalk.gray(message);
      case 'appStart':
        return (details: LogDetails) => this.getAppStartLog(details);
      default:
        return (message: string) => message;
    }
  }

  private static getAppStartLog(details: LogDetails): string {
    if (!details.port || !details.appName) {
      return '缺少必要的启动信息';
    }

    const time = new Date().toLocaleString();

    // 处理自定义名称、URL 和图标的地址
    const addresses = (details.extraAddresses || []).map((addr) => {
      const icon = addr.icon || '🔗'; // 如果未配置图标，使用默认图标
      return `${chalk.white(icon + ' ' + addr.name + ':')} ${chalk.cyan.underline(addr.url)}`;
    });

    return [
      `${chalk.green.bold('🚀 ' + details.appName)}`,
      `${chalk.gray('='.repeat(100))}`,
      ...addresses, // 插入所有自定义地址
      `${chalk.white('📍 端口:')} ${chalk.yellow.bold(details.port.toString())}`,
      `${chalk.white('📅 时间:')} ${chalk.blue(time)}`,
      `${chalk.gray('='.repeat(100))}`,
      details.message ? `${chalk.white('📝 ' + details.message)}` : '',
    ].join('\n');
  }

  public static log(type: LogLevel, details: LogDetails) {
    const logFormatter = this.getLogFormatter(type);
    let message: string;

    if (type === 'appStart') {
      message = logFormatter(details);
    } else {
      message = logFormatter(details.message);
    }

    if (type === 'appStart') {
      Logger.log(message, 'Bootstrap');
    } else if (type === 'error') {
      Logger.error(message, 'Error');
    } else if (type === 'warn') {
      Logger.warn(message, 'Warning');
    } else if (type === 'debug') {
      Logger.debug(message, 'Debug');
    } else {
      Logger.log(message, type);
    }
  }
}

export { LoggerService };
