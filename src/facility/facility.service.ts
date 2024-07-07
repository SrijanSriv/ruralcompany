import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FacilityService {
  constructor(private databaseService: DatabaseService) {}
  async create(createFacilityDto: Prisma.FacilityCreateInput) {
    return this.databaseService.facility.create({ data: createFacilityDto });
  }

  async findAll() {
    return this.databaseService.facility.findMany();
  }

  async findOne(id: number) {
    return this.databaseService.facility.findUnique({
      where: { facility_id: id },
    });
  }

  async update(id: number, updateFacilityDto: Prisma.FacilityUpdateInput) {
    return this.databaseService.facility.update({
      where: { facility_id: id },
      data: updateFacilityDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.facility.delete({
      where: { facility_id: id },
    });
  }
}
