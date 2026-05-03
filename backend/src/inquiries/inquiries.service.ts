import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InquiriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Check karein ke data null to nahi aa raha
    if (!data || !data.name) {
      throw new Error('Name is required');
    }
    return this.prisma.inquiry.create({
      data: {
        name: data.name,
        email: data.email,
        message: data.message,
      },
    });
  }

  async findAll() {
    // Bilkul simple query, koi include nahi
    return this.prisma.inquiry.findMany();
  }
}
