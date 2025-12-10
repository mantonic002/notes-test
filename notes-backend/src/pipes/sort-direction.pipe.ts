import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class SortDirectionPipe implements PipeTransform<
  string | undefined,
  1 | -1
> {
  transform(value: string | undefined): 1 | -1 {
    if (value === undefined) return -1; // default = newest first

    const num = Number(value);
    if (num !== 1 && num !== -1) {
      throw new BadRequestException('sort must be 1 or -1');
    }
    return num ;
  }
}
