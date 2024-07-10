import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // get reservation of a user
  @UseGuards(JwtAuthGuard)
  @Get('reservation')
  findAllUserReservations(@Request() req) {
    return this.userService.findAllUserReservations(req);
  }
}
