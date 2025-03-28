import {
    Controller,
    Post,
    Body,
    Request,
    UseGuards,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { RegisterDto } from './dto/register.dto';
  import { LocalAuthGuard } from './guards/local-auth.guard';
  
  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @Post('register')
    async register(@Body() dto: RegisterDto) {
      return this.authService.register(dto);
    }
  
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
      return this.authService.login(req.user);
    }
  }
  