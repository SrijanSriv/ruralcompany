import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FacilityModule } from './facility/facility.module';
import { ProviderModule } from './provider/provider.module';
import { BookslotModule } from './bookslot/bookslot.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [DatabaseModule, FacilityModule, ProviderModule, BookslotModule, ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
