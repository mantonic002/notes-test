import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/users/dto/sign-up.dto';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { Types } from 'mongoose';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUserId = new Types.ObjectId();

  const mockUser = {
    _id: mockUserId,
    username: 'testuser',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash the password and create a new user', async () => {
      const signUpDto: SignUpDto = {
        username: 'testuser',
        password: 'plainPassword123',
      };

      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.signUp(signUpDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...signUpDto,
        password: 'hashedPassword123',
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('signIn', () => {
    const signInDto: SignInDto = {
      username: 'testuser',
      password: 'plainPassword123',
    };

    it('should return an access_token when credentials are valid', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('jwt.token.here');

      const result = await service.signIn(signInDto);

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword123',
        'hashedPassword123',
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUserId,
        username: 'testuser',
      });
      expect(result).toEqual({ access_token: 'jwt.token.here' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      (usersService.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(signInDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plainPassword123',
        'hashedPassword123',
      );
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });
  });
});
