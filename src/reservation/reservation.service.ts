import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ReservationService {
  constructor(private databaseService: DatabaseService) {}
  async create(createReservationDto: Prisma.ReservationCreateInput) {
    return 'This action adds a new reservation';
  }

  async findAll() {
    return `This action returns all reservation`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  async update(
    id: number,
    updateReservationDto: Prisma.ReservationUpdateInput,
  ) {
    return `This action updates a #${id} reservation`;
  }

  async remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
