import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
  _id: Types.ObjectId;

  @Prop()
  note: string;

  @Prop()
  userId: Types.ObjectId;

  @Prop()
  group?: string;
}

export const NoteSchema = SchemaFactory.createForClass(Note);
