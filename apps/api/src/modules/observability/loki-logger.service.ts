import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class LokiLoggerService implements LoggerService {
  private formatLog(level: string, message: any, context?: string) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      context: context || 'App',
      message: typeof message === 'object' ? JSON.stringify(message) : message,
      service: 'ecivres-api',
      environment: process.env.NODE_ENV || 'development',
    });
  }

  log(message: any, context?: string) {
    console.log(this.formatLog('info', message, context));
  }

  error(message: any, trace?: string, context?: string) {
    console.error(this.formatLog('error', message, context), trace ? `\nTrace: ${trace}` : '');
  }

  warn(message: any, context?: string) {
    console.warn(this.formatLog('warn', message, context));
  }

  debug(message: any, context?: string) {
    console.debug(this.formatLog('debug', message, context));
  }
}
