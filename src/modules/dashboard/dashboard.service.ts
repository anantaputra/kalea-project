import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SpkEntity } from "../../infrastructure/database/typeorm/entities/Spk.entity";
import { SpkStageEntity } from "../../infrastructure/database/typeorm/entities/SpkStage.entity";


@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(SpkEntity)
    private readonly spkRepo: Repository<SpkEntity>,
    @InjectRepository(SpkStageEntity)
    private readonly spkStageRepo: Repository<SpkStageEntity>,
  ) {}

  async metrics() {
    const totalSpk = await this.spkRepo.count();
    const rawTotal = await this.spkStageRepo
      .createQueryBuilder('stage')
      .select('COALESCE(SUM(stage.qty_in), 0)', 'total')
      .where('LOWER(stage.stage_name) LIKE :packing', { packing: '%packing%' })
      .getRawOne<{ total: string | number }>();
    const totalItemDiproduksi = Number(rawTotal?.total ?? 0);

    const rawReject = await this.spkStageRepo
      .createQueryBuilder('stage')
      .select('COALESCE(SUM(stage.qty_reject), 0)', 'total')
      .getRawOne<{ total: string | number }>();
    const totalReject = Number(rawReject?.total ?? 0);

    const totalSpkDone = await this.spkRepo.count({ where: { status: 'DONE' } });

    return {
      summary: {
        total_spk_aktif: totalSpk,
        total_item_diproduksi: totalItemDiproduksi,
        total_reject: totalReject,
        spk_selesai_bulan_ini: totalSpkDone,
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
    };
  }
}