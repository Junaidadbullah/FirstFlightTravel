import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService, // Yahan PrismaService inject ho rahi hai
    private jwtService: JwtService,
  ) {}

  // 1. Signup: Password hash kar ke save karna
  async signup(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      const user = await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || 'USER',
        },
      });
      const { password, ...result } = user;
      return result;
    } catch (e) {
      throw new ConflictException('Email already registered');
    }
  }

  // 2. Validate: Login ke waqt password check karna
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 3. Login: JWT Token generate karna
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      role: user.role, // Ye line lazmi honi chahiye
      name: user.name,
    };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true, // 👈 Ye line database se naam uthaye gi
        email: true,
        role: true,
      },
    });
    return user;
  }
  async changePassword(userId: number, oldPass: string, newPass: string) {
    // 1. User ko database se dhoondein
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    // 🟢 Fix: Pehle check karein ke user null toh nahi hai
    if (!user) {
      throw new NotFoundException('User not found in database');
    }

    // 2. Purana password check karein (Database wala hashed hota hai)
    const isMatch = await bcrypt.compare(oldPass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(
        'Purana password darust nahi hai (Old password incorrect)',
      );
    }

    // 3. Naye password ko hash karein
    const hashedNewPassword = await bcrypt.hash(newPass, 10);

    // 4. Database mein naya password update kar dein
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });
  }
}
