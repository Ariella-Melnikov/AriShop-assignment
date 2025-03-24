import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../user/user.schema'; 
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) return user;

    return null;
  }

  async register(registerDto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: registerDto.email });
    if (existing) throw new UnauthorizedException('Email already registered');

    const hashed = await bcrypt.hash(registerDto.password, 10);
    const newUser = new this.userModel({ ...registerDto, password: hashed });
    const user = await newUser.save();

    return this.login(user);
  }

  async login(user: User) {
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
