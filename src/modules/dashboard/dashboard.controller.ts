import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}
  @ApiOperation({ summary: 'Dashboard metrics summary & charts' })
  @ApiOkResponse({
    description: 'Dashboard metrics',
    schema: {
      example: {
        summary: {
          total_spk_aktif: 24,
          total_item_diproduksi: 1250,
          total_reject: 45,
          spk_selesai_bulan_ini: 18,
        },
        charts: {
          spk_aktif: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: {
              '2024': [20, 15, 30, 0, 15, 24],
              '2023': [10, 5, 15, 30, 5, 22],
              '2022': [5, 0, 0, 15, 39, 20],
            },
          },
          item_diproduksi: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: {
              '2024': [1100, 1150, 1200, 1250, 1300, 1250],
              '2023': [1000, 1050, 1100, 1150, 1200, 1150],
              '2022': [900, 950, 1000, 1050, 1100, 1050],
            },
          },
          total_reject: {
            labels: ['Cutting', 'Jahit'],
            data: [25, 20],
          },
          spk_selesai: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: {
              '2024': [15, 16, 17, 18, 19, 18],
              '2023': [13, 14, 15, 16, 17, 16],
              '2022': [11, 12, 13, 14, 15, 14],
            },
          },
        },
      },
    },
  })
  @Get()
  async metrics() {
    return this.service.metrics();
  }
}
