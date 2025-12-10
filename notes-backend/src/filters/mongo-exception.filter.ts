import { Catch, BadRequestException } from '@nestjs/common';
import { MongooseError } from 'mongoose';
import { MongoServerError } from 'mongodb';

@Catch(MongooseError)
export class MongoExceptionFilter {
  catch(exception: unknown): void {
    if (exception instanceof MongooseError) {
      const mongoErr = exception.cause as MongoServerError | undefined;

      if (mongoErr?.code === 11000) {
        throw new BadRequestException(exception.message);
      }

      if (exception.name === 'CastError') {
        throw new BadRequestException('Invalid ID format');
      }

      if (exception.name === 'ValidationError') {
        throw new BadRequestException('Validation failed');
      }

      if (exception.name === 'StrictModeError') {
        throw new BadRequestException('Unknown field in request');
      }
    }
  }
}
