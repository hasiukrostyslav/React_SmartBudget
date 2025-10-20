import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const parsedValue = this.schema.safeParse(value);
    console.log(parsedValue);

    if (!parsedValue.success) {
      console.log(parsedValue);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: parsedValue.error.message,
      });
    }

    return parsedValue.data;
  }
}
