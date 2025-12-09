import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './schemas/notes.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const createdNote = new this.noteModel(createNoteDto);
    return createdNote.save();
  }

  async findAll(userId: Types.ObjectId): Promise<Note[]> {
    return this.noteModel.find({ userId: userId }).exec();
  }

  async update(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    const result = await this.noteModel
      .findOneAndUpdate({ _id: id, userId }, updateNoteDto, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException(
        'Note not found or you do not have permission.',
      );
    }

    return result;
  }

  async remove(id: Types.ObjectId, userId: Types.ObjectId): Promise<void> {
    const result = await this.noteModel.deleteOne({ _id: id, userId }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Note not found or you do not have permission.',
      );
    }
  }
}
