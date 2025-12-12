import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Types } from 'mongoose';
import { AuthGuard } from 'src/auth/auth.guard';
import { NotFoundException } from '@nestjs/common';

const mockAuthGuard = () => ({ canActivate: jest.fn(() => true) });

describe('NotesController', () => {
  let controller: NotesController;
  let mockNotesService: Partial<NotesService>;

  beforeEach(async () => {
    mockNotesService = {
      create: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard())
      .compile();

    controller = module.get<NotesController>(NotesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should assign userId from authenticated user and call notesService.create', async () => {
      const userId = new Types.ObjectId();
      const createNoteDto: CreateNoteDto = { note: 'Test note' };
      const expectedDto = { ...createNoteDto, userId };
      const mockResult = { _id: new Types.ObjectId(), ...expectedDto };

      (mockNotesService.create as jest.Mock).mockResolvedValue(mockResult);

      // Simulate @User decorator by passing userId directly
      const result = await controller.create(userId, createNoteDto);

      expect(mockNotesService.create).toHaveBeenCalledWith(expectedDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('findAll', () => {
    it('should call notesService.findAll with correct parameters (default values)', async () => {
      const userId = new Types.ObjectId();
      const mockResult = { count: 5, notes: [] };

      (mockNotesService.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.findAll(userId);

      expect(mockNotesService.findAll).toHaveBeenCalledWith(userId, 1, 10, -1);
      expect(result).toEqual(mockResult);
    });

    it('should call notesService.findAll with custom page, size, and sort parameters', async () => {
      const userId = new Types.ObjectId();
      const mockResult = { count: 20, notes: [] };

      (mockNotesService.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await controller.findAll(userId, 3, 20, 1);

      expect(mockNotesService.findAll).toHaveBeenCalledWith(userId, 3, 20, 1);
      expect(result).toEqual(mockResult);
    });
  });

  describe('update', () => {
    it('should call notesService.update with correct parameters and return updated note', async () => {
      const noteId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const updateNoteDto: UpdateNoteDto = { note: 'Updated note' };
      const mockUpdatedNote = {
        _id: noteId,
        note: 'Updated note',
        userId,
      };

      (mockNotesService.update as jest.Mock).mockResolvedValue(mockUpdatedNote);

      const result = await controller.update(noteId, userId, updateNoteDto);

      expect(mockNotesService.update).toHaveBeenCalledWith(
        noteId,
        userId,
        updateNoteDto,
      );
      expect(result).toEqual(mockUpdatedNote);
    });

    it('should forward NotFoundException when service throws it', async () => {
      const noteId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const updateNoteDto: UpdateNoteDto = { note: 'Updated note' };

      (mockNotesService.update as jest.Mock).mockRejectedValue(
        new NotFoundException('Note not found or you do not have permission.'),
      );

      await expect(
        controller.update(noteId, userId, updateNoteDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should call notesService.remove with correct parameters and return undefined (void)', async () => {
      const noteId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      (mockNotesService.remove as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.remove(noteId, userId);

      expect(mockNotesService.remove).toHaveBeenCalledWith(noteId, userId);
      expect(result).toBeUndefined();
    });

    it('should forward NotFoundException when service throws it', async () => {
      const noteId = new Types.ObjectId();
      const userId = new Types.ObjectId();

      (mockNotesService.remove as jest.Mock).mockRejectedValue(
        new NotFoundException('Note not found or you do not have permission.'),
      );

      await expect(controller.remove(noteId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
