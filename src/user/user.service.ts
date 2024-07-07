import { Injectable } from '@nestjs/common';
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
}
