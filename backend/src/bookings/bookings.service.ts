import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // 👈 Naye fields (passengerName, etc.) yahan parameter mein add kar di hain
  async create(
    userId: number, 
    flightId: number, 
    passengerName: string, 
    passportNumber: string, 
    contactEmail: string, 
    phone: string
  ) {
    return this.prisma.booking.create({
      data: {
        userId: userId,
        flightId: flightId,
        passengerName: passengerName,    // 👈 Naya Column
        passportNumber: passportNumber,  // 👈 Naya Column
        contactEmail: contactEmail,      // 👈 Naya Column
        phone: phone,                    // 👈 Naya Column
        status: "CONFIRMED",
      },
      include: {
        flight: true,
        user: { select: { name: true, email: true } }
      }
    });
  }

  async findMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { flight: true },
      orderBy: { createdAt: 'desc' } // 👈 Newest bookings top par ayengi
    });
  }

  async cancelBooking(bookingId: number, userId: number) {
    return this.prisma.booking.update({
      where: { 
        id: bookingId,
        userId: userId 
      },
      data: { status: 'CANCELLED' }
    });
  }
}