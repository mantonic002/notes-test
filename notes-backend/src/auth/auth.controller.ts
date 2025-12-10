import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/users/dto/sign-up.dto';
import { SignInDto } from 'src/users/dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signIn: SignInDto) {
    return this.authService.signIn(signIn);
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signUp: SignUpDto) {
    return this.authService.signUp(signUp);
  }
}
