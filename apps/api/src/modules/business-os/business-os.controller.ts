import { Controller, Post, Body } from '@nestjs/common';
import { EquipmentInventoryService } from './equipment-inventory.service';
import { TrackEquipmentDto } from './dto/equipment.dto';

@Controller('business-os')
export class BusinessOsController {
  constructor(private readonly equipmentService: EquipmentInventoryService) {}

  @Post('equipment')
  registerEquipment(@Body() dto: TrackEquipmentDto) {
    return this.equipmentService.registerEquipment(dto);
  }
}
