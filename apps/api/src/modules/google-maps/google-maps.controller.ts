import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoogleMapsService } from './services/google-maps.service';

@ApiTags('google-maps')
@Controller('google-maps')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GoogleMapsController {
  constructor(private readonly mapsService: GoogleMapsService) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Places autocomplete suggestions' })
  async autocomplete(@Query('query') query: string) {
    return this.mapsService.autocompletePlaces(query || '');
  }

  @Get('geocode')
  @ApiOperation({ summary: 'Geocode address into coordinates' })
  async geocode(@Query('address') address: string) {
    return this.mapsService.geocodeAddress(address || '');
  }

  @Get('reverse-geocode')
  @ApiOperation({ summary: 'Reverse geocode coordinates into address' })
  async reverseGeocode(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.mapsService.reverseGeocode(parseFloat(lat || '0'), parseFloat(lng || '0'));
  }

  @Get('route')
  @ApiOperation({ summary: 'Routes API direction calculation' })
  async route(@Query('originLat') oLat: string, @Query('originLng') oLng: string, @Query('destLat') dLat: string, @Query('destLng') dLng: string) {
    return this.mapsService.calculateRoute(parseFloat(oLat || '0'), parseFloat(oLng || '0'), parseFloat(dLat || '0'), parseFloat(dLng || '0'));
  }
}
