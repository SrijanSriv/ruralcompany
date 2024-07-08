import { Injectable, Request } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

function getDayToday() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

@Injectable()
export class ReservationService {
  constructor(private databaseService: DatabaseService) {}
  async create(
    createReservationDto: Prisma.ReservationCreateInput,
    @Request() req,
  ) {
    const reservation = createReservationDto;
    const user = req.user;
    reservation.user_id = user.user_id;
    return this.databaseService.reservation.create({
      data: reservation,
    });
  }

  async findAllAvailableSlots(id: string, date?: string) {
    // Get all the details for a facility, in order to determine slot size via facility_time, cost etc.
    const facilityInfo = await this.databaseService.facility.findUnique({
      where: { facility_id: parseInt(id) },
    });

    // If facilityInfo is null, return an empty array
    if (!facilityInfo) {
      return [];
    }

    // Get all the providers for a facility, in order to determine the available slots based on the provider's availability
    const providersForFacility = await this.databaseService.provider.findMany({
      where: { facility_id: parseInt(id) },
    });

    // Get all the slots that have been booked for a particular facility for a given day, in order to filter those out
    const dayRequested = date ? date : getDayToday();
    const bookedSlotsForFacility =
      await this.databaseService.reservation.findMany({
        where: { facility_id: parseInt(id), reservation_date: dayRequested },
      });

    // Get the current time in hours
    const currentHour = date === getDayToday() ? new Date().getHours() : 0;
    const startTime = Math.max(currentHour + 2, 10); // Start time is 2 hours from the current time OR from 10 AM
    const endTime = 18; // Slots should not cross 6 PM
    const slotSize = facilityInfo.facility_time;

    // Define all possible slots based on the start time, end time, and slot size
    const allSlots = [];
    for (let i = startTime; i < endTime; i += slotSize) {
      const slotEnd = i + slotSize;
      if (slotEnd <= endTime) {
        allSlots.push({
          start: i,
          end: slotEnd,
          providers: providersForFacility,
        });
      }
    }

    // if there are no booked slots for the mentioned day, return all slots
    if (bookedSlotsForFacility.length === 0) return allSlots;

    // Filter out the booked slots and providers
    const availableSlots = allSlots
      .map((slot) => {
        // Copy the slot providers to avoid mutating the original data
        const availableProviders = [...slot.providers];

        // Remove booked providers from the current slot
        bookedSlotsForFacility.forEach((bookedSlot) => {
          const bookedStart = bookedSlot.timeslot_start;
          const bookedEnd = bookedSlot.timeslot_end;

          if (slot.start < bookedEnd && bookedStart < slot.end) {
            const bookedProviderId = bookedSlot.provider_id;
            const providerIndex = availableProviders.findIndex(
              (provider) => provider.provider_id === bookedProviderId,
            );
            if (providerIndex > -1) {
              availableProviders.splice(providerIndex, 1);
            }
          }
        });

        // Update the slot's providers
        slot.providers = availableProviders;

        return slot;
      })
      .filter((slot) => slot.providers.length > 0); // Remove slots with no available providers

    return availableSlots;
  }

  async findAllUserReservations(id: string) {
    return this.databaseService.reservation.findMany({
      where: { user_id: parseInt(id) },
    });
  }

  async findOne(id: number) {
    return this.databaseService.reservation.findUnique({
      where: { reservation_id: id },
    });
  }

  async update(
    id: number,
    updateReservationDto: Prisma.ReservationUpdateInput,
  ) {
    return this.databaseService.reservation.update({
      where: { reservation_id: id },
      data: updateReservationDto,
    });
  }

  async remove(id: number) {
    return this.databaseService.reservation.delete({
      where: { reservation_id: id },
    });
  }
}
