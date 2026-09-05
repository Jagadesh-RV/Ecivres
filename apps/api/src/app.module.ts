import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { UsersModule } from './modules/users/users.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RolesModule } from './modules/roles/roles.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ServicesModule } from './modules/services/services.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { PayoutsModule } from './modules/payouts/payouts.module';
import { SupportTicketsModule } from './modules/tickets/tickets.module';
import { PlatformSettingsModule } from './modules/settings/settings.module';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20,
    }]),
    PrismaModule,
    AuthModule,
    CustomersModule,
    BookingsModule,
    UsersModule,
    ProvidersModule,
    PaymentsModule,
    RolesModule,
    CategoriesModule,
    ReviewsModule,
    PermissionsModule,
    ServicesModule,
    NotificationsModule,
    AdminModule,
    CouponsModule,
    PayoutsModule,
    SupportTicketsModule,
    PlatformSettingsModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
