import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { RegionalConfigService } from './services/regional-config.service';
import { CountryActivationService } from './services/country-activation.service';
import { CountryController } from './country.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CountryController],
  providers: [RegionalConfigService, CountryActivationService],
  exports: [RegionalConfigService, CountryActivationService],
})
export class CountryModule {}
