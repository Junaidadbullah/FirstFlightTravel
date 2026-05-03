import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Request() req: any, @Body() body: any) {
    // 👈 Body se saara naya data nikaal kar service ko bhej rahe hain
    return this.bookingsService.create(
      req.user.userId,
      +body.flightId,
      body.passengerName,
      body.passportNumber,
      body.contactEmail,
      body.phone,
    );
  }

  @Get('my-bookings')
  async getMyBookings(@Request() req: any) {
    return this.bookingsService.findMyBookings(req.user.userId);
  }

  @Patch(':id/cancel')
  async cancel(@Param('id') id: string, @Request() req: any) {
    return this.bookingsService.cancelBooking(+id, req.user.userId);
  }
}
