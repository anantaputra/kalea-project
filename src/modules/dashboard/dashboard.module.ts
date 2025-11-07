import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { SpkEntity } from '../../infrastructure/database/typeorm/entities/Spk.entity';
import { SpkStageEntity } from '../../infrastructure/database/typeorm/entities/SpkStage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpkEntity,
      SpkStageEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
  ],
})
export class DashboardModule {}