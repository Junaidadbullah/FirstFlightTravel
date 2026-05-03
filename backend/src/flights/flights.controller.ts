import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @UseGuards(JwtAuthGuard) // Sirf Admin/User hi flight add kar sakay
  @Post()
  create(@Body() body: any) {
    return this.flightsService.create(body);
  }

  @Get()
  findAll() {
    return this.flightsService.findAll();
  }
}