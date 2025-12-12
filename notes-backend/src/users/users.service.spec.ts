import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { UsersService } from './users.service';
import { User, UserDocument } from './schemas/users.schema';
import { SignUpDto } from './dto/sign-up.dto';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  const mockUserId = new Types.ObjectId();

  const mockUser = {
    _id: mockUserId,
    username: 'testuser',
    password: 'hashedpassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'hashedpassword123',
      };

      (model.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(signUpDto);

      expect(model.create).toHaveBeenCalledWith(signUpDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when user creation fails (duplicate username for example)', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'hashedpassword123',
      };
      const mongoError = new MongooseError(
        'E11000 duplicate key error collection...',
      );

      (model.create as jest.Mock).mockRejectedValue(mongoError);

      await expect(service.create(signUpDto)).rejects.toThrow(mongoError);
    });
  });

  describe('findOne', () => {
    it('should return a user with password selected when found', async () => {
      const username = 'testuser';

      const chainableQueryMock = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUser),
      };

      (model.findOne as jest.Mock).mockReturnValue(chainableQueryMock);

      const result = await service.findOne(username);

      expect(model.findOne).toHaveBeenCalledWith({ username });
      expect(chainableQueryMock.select).toHaveBeenCalledWith('+password');
      expect(chainableQueryMock.exec).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const username = 'nonexistent';

      const chainableQueryMock = {
        select: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      (model.findOne as jest.Mock).mockReturnValue(chainableQueryMock);

      const result = await service.findOne(username);

      expect(model.findOne).toHaveBeenCalledWith({ username });
      expect(chainableQueryMock.select).toHaveBeenCalledWith('+password');
      expect(chainableQueryMock.exec).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
