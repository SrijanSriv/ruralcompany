import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // returns all the slots that actually available for a particular service, not all booked slots
  @Get('/:id')
  findAllAvailableSlots(@Param('id') id: string, @Query('date') date?: string) {
    return this.reservationService.findAllAvailableSlots(id, date);
  }

  // returns all the reservations for a particular user
  @UseGuards(JwtAuthGuard)
  @Get('/user/:id')
  findAllUserReservations(@Param('id') id: string) {
    return this.reservationService.findAllUserReservations(id);
  }

  // basic CRUD operations for a reservation
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createReservationDto: Prisma.ReservationCreateInput,
    @Request() req,
  ) {
    return this.reservationService.create(createReservationDto, req);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: Prisma.ReservationUpdateInput,
  ) {
    return this.reservationService.update(+id, updateReservationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
