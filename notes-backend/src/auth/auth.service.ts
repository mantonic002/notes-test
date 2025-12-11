import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { SignUpDto } from 'src/users/dto/sign-up.dto';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUp: SignUpDto): Promise<User> {
    const saltRounds = 10;
    signUp.password = await bcrypt.hash(signUp.password, saltRounds);

    return this.usersService.create(signUp);
  }

  async signIn(signIn: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOne(signIn.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordMatches = await bcrypt.compare(
      signIn.password,
      user.password!,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
