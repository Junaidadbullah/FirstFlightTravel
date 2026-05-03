import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightsController } from './flights.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Path check kar lein

@Module({
  imports: [PrismaModule], // PrismaModule yahan hona chahiye
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}