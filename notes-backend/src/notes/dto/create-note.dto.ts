import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateNoteDto {
  @IsNotEmpty()
  note: string;

  @IsOptional()
  userId: Types.ObjectId;
}
