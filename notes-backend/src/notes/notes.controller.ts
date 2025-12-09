import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { Types } from 'mongoose';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@User('sub') userId: string, @Body() createNoteDto: CreateNoteDto) {
    createNoteDto.userId = new Types.ObjectId(userId);
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@User('sub') userId: string) {
    const userObjId = new Types.ObjectId(userId);
    return this.notesService.findAll(userObjId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @User('sub') userId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const userObjId = new Types.ObjectId(userId);
    const objId = new Types.ObjectId(id);
    return this.notesService.update(objId, userObjId, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @User('sub') userId: string) {
    const userObjId = new Types.ObjectId(userId);
    const objId = new Types.ObjectId(id);
    return this.notesService.remove(objId, userObjId);
  }
}
