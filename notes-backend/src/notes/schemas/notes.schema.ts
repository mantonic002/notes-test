import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NoteDocument = HydratedDocument<Note>;

@Schema({
  timestamps: true,
})
export class Note {
  _id: Types.ObjectId;

  @Prop({ required: true })
  note: string;

  @Prop({ required: true, index: true })
  userId: Types.ObjectId;
}

export const NoteSchema = SchemaFactory.createForClass(Note);

NoteSchema.index({ userId: 1, createdAt: -1 });
