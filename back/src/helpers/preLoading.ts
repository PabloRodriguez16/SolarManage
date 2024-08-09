import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Panel } from 'src/entities/panel.entity';
import { pvsystPreloadRepository } from '../repositories/pvsystPreload.repository';
import { statsPreloadRepository } from '../repositories/statsPreload.repository';
import { plantas } from 'src/utils/plantas/plantas';

import { bodegasSalcobrand } from 'src/utils/bodegasSalcobrand/bodegasSalcobrand';
import { centrovet255 } from 'src/utils/centrovet255/centrovet';
import { centrovet601 } from 'src/utils/centrovet601/centrovet601';
import { ekonoelsalto } from 'src/utils/ekonoelsalto/eknoelsalto';
import { AvailableYears } from 'src/entities/availableYears.entity';
import { Stats } from 'src/entities/stats.entity';

@Injectable()
export class Preloading {
  constructor(
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
    @InjectRepository(AvailableYears)
    private readonly availableYearsRepository: Repository<AvailableYears>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    private readonly pvsystPreloadRepository: pvsystPreloadRepository,
    private readonly statsPreloadRepository: statsPreloadRepository,
  ) {}

  async preloading(): Promise<void> {
    for (const planta of plantas) {
      const panel = await this.panelRepository.findOne({
        where: { name: planta.name },
      });

      if (!panel) {
        const newPanel = this.panelRepository.create({
          name: planta.name,
          inversor: planta.inversor,
          address: planta.address,
        });

        await this.panelRepository.save(newPanel);

        switch (newPanel.name) {
          case 'PLANT N1':
            await this.pvsystPreloadRepository.pvsystBodegasSalcobrand();
            await this.statsPreloadRepository.saveStats(
              'PLANT N1',
              bodegasSalcobrand,
            );
            break;
          case 'PLANT N2':
            await this.pvsystPreloadRepository.pvsystCentrovet();
            await this.statsPreloadRepository.saveStats(
              'PLANT N2',
              centrovet255,
            );
            break;
          case 'PLANT N3':
            await this.pvsystPreloadRepository.pvsystCentrovet601();
            await this.statsPreloadRepository.saveStats(
              'PLANT N3',
              centrovet601,
            );
            break;
          case 'PLANT N4':
            await this.pvsystPreloadRepository.pvsystEnokoElSalto();
            await this.statsPreloadRepository.saveStats(
              'PLANT N4',
              ekonoelsalto,
            );
            break;
        }
      }
    }
  }
}
