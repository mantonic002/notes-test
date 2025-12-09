import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
  @Prop()
  note: string;

  @Prop()
  user_id?: string;

  @Prop()
  group?: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
