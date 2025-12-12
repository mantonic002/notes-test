import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUser: SignUpDto): Promise<User> {
    return this.userModel.create(createUser);
  }

  async findOne(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).select('+password').exec();
  }
}
