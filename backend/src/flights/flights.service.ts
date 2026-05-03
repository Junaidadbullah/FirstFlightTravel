import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlightsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.flight.create({
      data: {
        origin: data.origin,
        destination: data.destination,
        price: data.price,
        status: data.status || 'ACTIVE',
        tags: {
          connectOrCreate: data.tags?.map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  async findAll() {
    return this.prisma.flight.findMany({
      include: {
        tags: true,
      },
    });
  }
}
