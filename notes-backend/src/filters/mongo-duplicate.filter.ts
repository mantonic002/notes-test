import { Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { MongooseError } from 'mongoose';

@Catch()
export class MongoDuplicateFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof MongooseError) {
       if ( exception.message.includes('Duplicate username')) {

        const message = 'Username already exists';

        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message,
          error: 'Bad Request',
        });
        return;
      }
    }

    super.catch(exception, host);
  }
}
