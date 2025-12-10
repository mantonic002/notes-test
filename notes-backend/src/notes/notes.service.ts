import { Model, Types } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './schemas/notes.schema';

@Injectable()
export class NotesService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(createNote: CreateNoteDto): Promise<Note> {
    return this.noteModel.create(createNote);
  }

  async findAll(
    userId: Types.ObjectId,
    page: number,
    limit: number,
    sortByDate: -1 | 1, // -1 newest to oldest, 1 oldest to newest
  ): Promise<{ count: number; notes: Note[] }> {
    const skip = (page - 1) * limit;

    const count = await this.noteModel.countDocuments({ userId }).exec();

    let notesQuery = this.noteModel.find({ userId });

    if (sortByDate == -1) {
      notesQuery = notesQuery.sort({ createdAt: sortByDate });
    }

    notesQuery = notesQuery.skip(skip).limit(limit);

    const notes = await notesQuery.exec();
    return { count, notes };
  }

  async update(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    updateNote: UpdateNoteDto,
  ): Promise<Note> {
    const result = await this.noteModel
      .findOneAndUpdate({ _id: id, userId }, updateNote, { new: true })
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
