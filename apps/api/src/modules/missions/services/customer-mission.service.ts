import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CustomerMissionService {
  private readonly logger = new Logger(CustomerMissionService.name);

  getDailyMissions(userId: string) {
    this.logger.log(`Fetching daily missions for user ${userId}`);
    return [
      { id: 'msn_1', title: 'Complete 1 Cleaning Booking', rewardPoints: 100, isCompleted: false },
      { id: 'msn_2', title: 'Leave a 5-Star Provider Review', rewardPoints: 50, isCompleted: true },
      { id: 'msn_3', title: 'Share Invite Link with 1 Friend', rewardPoints: 75, isCompleted: false },
    ];
  }
}
