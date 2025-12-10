import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNoteDto {
  @IsNotEmpty()
  @IsOptional()
  note?: string;

  @IsNotEmpty()
  @IsOptional()
  group?: string;
}
