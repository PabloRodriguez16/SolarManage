import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stats } from 'src/entities/stats.entity';
import { PanelsController } from 'src/controllers/panels.controller';
import { Panel } from 'src/entities/panel.entity';
import { Pvsyst } from 'src/entities/pvsyst.entity';
import { PanelRepository } from 'src/repositories/panel.repository';
import { pvsystPreloadRepository } from 'src/repositories/pvsystPreload.repository';
import { statsPreloadRepository } from 'src/repositories/statsPreload.repository';
import { DashboardService } from 'src/helpers/getDataFromDashboard';
import { Preloading } from 'src/helpers/preLoading';
import { AvailableYears } from 'src/entities/availableYears.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Panel, Stats, Pvsyst, AvailableYears])],
  controllers: [PanelsController],
  providers: [
    PanelRepository,
    pvsystPreloadRepository,
    statsPreloadRepository,
    DashboardService,
    Preloading,
  ],
  exports: [],
})
export class PanelsModule {}
