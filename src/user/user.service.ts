import { Injectable, Request } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}
  async findUser(email: string) {
    const user = await this.databaseService.user.findUnique({
      where: { email: email },
    });
    return user;
  }
  async create(email: string, password: string) {
    const user = await this.databaseService.user.create({
      data: {
        username: email,
        email: email,
        password: password,
      },
    });
    return user;
  }
  async findAllUserReservations(@Request() req) {
    const user = req.user;
    const reservations = await this.databaseService.reservation.findMany({
      where: { user_id: user.user_id },
    });
    return reservations;
  }
}
