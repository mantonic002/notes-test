import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Types } from 'mongoose';
import { ObjectIdPipe } from 'src/pipes/object-id.pipe';
import { SortDirectionPipe } from 'src/pipes/sort-direction.pipe';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @User('sub', ObjectIdPipe) userId: Types.ObjectId,
    @Body() createNote: CreateNoteDto,
  ) {
    createNote.userId = userId;
    return this.notesService.create(createNote);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(
    @User('sub', ObjectIdPipe) userId: Types.ObjectId,
    @Query('page', new ParseIntPipe({ optional: true })) page = 1,
    @Query('size', new ParseIntPipe({ optional: true })) size = 10,
    @Query('sort', SortDirectionPipe) sort: 1 | -1 = -1, // -1(default) newest to oldest, 1 oldest to newest
  ) {
    return this.notesService.findAll(userId, page, size, sort);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @User('sub', ObjectIdPipe) userId: Types.ObjectId,
    @Body() updateNote: UpdateNoteDto,
  ) {
    return this.notesService.update(id, userId, updateNote);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(
    @Param('id', ObjectIdPipe) id: Types.ObjectId,
    @User('sub', ObjectIdPipe) userId: Types.ObjectId,
  ) {
    return this.notesService.remove(id, userId);
  }
}
