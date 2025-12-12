import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotesService } from './notes.service';
import { Note, NoteDocument } from './schemas/notes.schema';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('NotesService', () => {
  let service: NotesService;
  let model: Model<NoteDocument>;

  const mockUserId = new Types.ObjectId();
  const mockNoteId = new Types.ObjectId();

  const mockNote = {
    _id: mockNoteId,
    note: 'Test note content',
    userId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // create a chainable mock query
  const createQueryMock = (resolveValue: any) => ({
    sort: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(resolveValue),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getModelToken(Note.name),
          useValue: {
            create: jest.fn(),
            countDocuments: jest.fn(),
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    model = module.get<Model<NoteDocument>>(getModelToken(Note.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new note', async () => {
      const createNoteDto: CreateNoteDto = {
        note: 'Test note content',
        userId: mockUserId,
      };

      (model.create as jest.Mock).mockResolvedValue(mockNote);

      const result = await service.create(createNoteDto);

      expect(model.create).toHaveBeenCalledWith(createNoteDto);
      expect(result).toEqual(mockNote);
    });
  });

  describe('findAll', () => {
    it('should return paginated notes and total count (default sort newest first)', async () => {
      const count = 25;
      const notes = [mockNote];

      const countQueryMock = {
        exec: jest.fn().mockResolvedValue(count),
      };
      (model.countDocuments as jest.Mock).mockReturnValue(countQueryMock);

      const queryMock = createQueryMock(notes);
      (model.find as jest.Mock).mockReturnValue(queryMock);

      const result = await service.findAll(mockUserId, 2, 10, -1);

      expect(model.countDocuments).toHaveBeenCalledWith({ userId: mockUserId });
      expect(countQueryMock.exec).toHaveBeenCalled();
      expect(model.find).toHaveBeenCalledWith({ userId: mockUserId });
      expect(queryMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(queryMock.skip).toHaveBeenCalledWith(10);
      expect(queryMock.limit).toHaveBeenCalledWith(10);
      expect(queryMock.exec).toHaveBeenCalled();
      expect(result).toEqual({ count, notes });
    });

    it('should not call sort when sortByDate is 1', async () => {
      const countQueryMock = { exec: jest.fn().mockResolvedValue(0) };
      (model.countDocuments as jest.Mock).mockReturnValue(countQueryMock);

      const queryMock = createQueryMock([]);
      (model.find as jest.Mock).mockReturnValue(queryMock);

      await service.findAll(mockUserId, 1, 10, 1);

      expect(queryMock.sort).not.toHaveBeenCalled();
      expect(countQueryMock.exec).toHaveBeenCalled();
    });

    it('should apply default newest-first sort when sortByDate is -1', async () => {
      const countQueryMock = { exec: jest.fn().mockResolvedValue(0) };
      (model.countDocuments as jest.Mock).mockReturnValue(countQueryMock);

      const queryMock = createQueryMock([]);
      (model.find as jest.Mock).mockReturnValue(queryMock);

      await service.findAll(mockUserId, 1, 10, -1);

      expect(queryMock.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(countQueryMock.exec).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return the updated note', async () => {
      const updateNoteDto: UpdateNoteDto = { note: 'Updated content' };
      const updatedNote = { ...mockNote, note: 'Updated content' };

      const queryMock = {
        exec: jest.fn().mockResolvedValue(updatedNote),
      };
      (model.findOneAndUpdate as jest.Mock).mockReturnValue(queryMock);

      const result = await service.update(
        mockNoteId,
        mockUserId,
        updateNoteDto,
      );

      expect(model.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockNoteId, userId: mockUserId },
        updateNoteDto,
        { new: true },
      );
      expect(queryMock.exec).toHaveBeenCalled();
      expect(result).toEqual(updatedNote);
    });

    it('should throw NotFoundException if note not found or wrong user', async () => {
      const updateNoteDto: UpdateNoteDto = { note: 'Updated content' };

      const queryMock = {
        exec: jest.fn().mockResolvedValue(null),
      };
      (model.findOneAndUpdate as jest.Mock).mockReturnValue(queryMock);

      await expect(
        service.update(mockNoteId, mockUserId, updateNoteDto),
      ).rejects.toThrow(
        new NotFoundException('Note not found or you do not have permission.'),
      );
    });
  });

  describe('remove', () => {
    it('should delete the note successfully', async () => {
      const queryMock = {
        exec: jest.fn().mockResolvedValue({ deletedCount: 1 }),
      };
      (model.deleteOne as jest.Mock).mockReturnValue(queryMock);

      await service.remove(mockNoteId, mockUserId);

      expect(model.deleteOne).toHaveBeenCalledWith({
        _id: mockNoteId,
        userId: mockUserId,
      });
      expect(queryMock.exec).toHaveBeenCalled();
    });

    it('should throw NotFoundException if note not found or wrong user', async () => {
      const queryMock = {
        exec: jest.fn().mockResolvedValue({ deletedCount: 0 }),
      };
      (model.deleteOne as jest.Mock).mockReturnValue(queryMock);

      await expect(service.remove(mockNoteId, mockUserId)).rejects.toThrow(
        new NotFoundException('Note not found or you do not have permission.'),
      );
    });
  });
});
