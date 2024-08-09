import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatsDto } from 'src/dtos/stats.dto';
import { Repository } from 'typeorm';
import { Panel } from 'src/entities/panel.entity';
import { pvsystPreloadRepository } from './pvsystPreload.repository';
import { Stats } from 'src/entities/stats.entity';
import { DashboardService } from 'src/helpers/getDataFromDashboard';
import { Preloading } from 'src/helpers/preLoading';
import { AvailableYears } from 'src/entities/availableYears.entity';

const XLSX = require('xlsx');

@Injectable()
export class PanelRepository implements OnModuleInit {
  constructor(
    private readonly pvsystPreloadRepository: pvsystPreloadRepository,
    private readonly Dashboard: DashboardService,
    private readonly preloading: Preloading,
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    @InjectRepository(AvailableYears)
    private readonly availableYearsRepository: Repository<AvailableYears>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.preloading.preloading();
  }

  async readExcel(buffer: Buffer) {
    try {
      const workbook: any = XLSX.read(buffer, { type: 'buffer', raw: true });
      const sheet: string = workbook.Sheets[workbook.SheetNames[0]];
      const dataExcel: string = XLSX.utils.sheet_to_json(sheet);
      if (dataExcel.length === 0) {
        throw new BadRequestException('Excel is empty');
      }
      return dataExcel;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw error;
    }
  }

  async extractDataIngecon(data: any): Promise<StatsDto[]> {
    try {
      if (data[0].GId) {
        const extractedData = [];

        for (const stat of data) {
          let energy = stat['Energy(kWh)'];
          if (stat['Energy(kWh)'] === 'NaN') energy = '0';

          extractedData.push({
            day: stat['DateTime'].split(' ')[0].split('-')[2],
            month: stat['DateTime'].split(' ')[0].split('-')[1],
            year: stat['DateTime'].split(' ')[0].split('-')[0],
            energyGenerated: energy,
          });
        }
        return extractedData;
      } else {
        const extractedData = [];

        for (const stat of data) {
          extractedData.push({
            day: stat['dateTime'].split(' ')[0].split('-')[2],
            month: stat['dateTime'].split(' ')[0].split('-')[1],
            year: stat['dateTime'].split(' ')[0].split('-')[0],
            energyGenerated: stat['pvGeneration(kWh)'],
          });
        }

        return extractedData;
      }
    } catch (error) {
      throw error;
    }
  }

  async updatePanelStats(data: any, panelName: string) {
    try {
      const newData = await this.extractDataIngecon(data);

      const years = await this.availableYearsRepository.find({
        where: { year: newData[0].year },
      });

      if (years.length === 0) {
        console.log('i am here');
        const panel = await this.panelRepository.findOne({
          where: { name: panelName },
          relations: ['stats'],
        });

        if (!panel) {
          throw new BadRequestException('Panel not found');
        }

        const newYear = this.availableYearsRepository.create({
          year: newData[0].year,
          panel: panel,
        });

        await this.availableYearsRepository.save(newYear);
      }

      const panel = await this.panelRepository.findOne({
        where: { name: panelName },
        relations: ['stats'],
      });

      if (!panel) {
        throw new BadRequestException('Panel not found');
      }

      const allStats = await this.statsRepository.find({
        where: { panel: { id: panel.id } },
        relations: ['panel'],
      });

      for (const item of newData) {
        const stat = this.statsRepository.create(item);
        let updated = false;

        for (const oldStat of allStats) {
          if (
            stat.day == oldStat.day &&
            stat.month == oldStat.month &&
            stat.year == oldStat.year
          ) {
            await this.statsRepository.update(oldStat.id, {
              energyGenerated: stat.energyGenerated,
            });

            updated = true;
            break;
          }
        }
        if (!updated) {
          stat.panel = panel;
          await this.statsRepository.save(stat);
        }
      }

      const updatedStats = await this.statsRepository.find({
        where: { panel: { id: panel.id } },
      });

      panel.stats = updatedStats;

      await this.panelRepository.save(panel);

      return newData;
    } catch (error) {
      throw error;
    }
  }

  async getAllPanels(): Promise<Panel[]> {
    return await this.panelRepository.find();
  }

  async getPanelById(id: string): Promise<Panel> {
    const panel = await this.panelRepository.findOne({
      where: { id },
      relations: ['stats'],
    });

    if (panel && panel.stats) {
      panel.stats.sort((a, b) => {
        // Ordenar por año, mes y día ascendente
        if (a.year !== b.year) {
          return a.year - b.year;
        }
        if (a.month !== b.month) {
          return a.month - b.month;
        }
        return a.day - b.day;
      });
    }
    return panel;
  }

  async getDataForDashboard(name: string, month?: number, year?: number) {
    return await this.Dashboard.dataForDashboard(name, month, year);
  }

  uploadPvsyst(data: any) {
    switch (data.panel) {
      case 'PLANT N1':
        return this.pvsystPreloadRepository.pvsystBodegasSalcobrand(data);

      case 'PLANT N2':
        return this.pvsystPreloadRepository.pvsystCentrovet(data);

      case 'PLANT N3':
        return this.pvsystPreloadRepository.pvsystCentrovet601(data);

      case 'PLANT N4':
        return this.pvsystPreloadRepository.pvsystEnokoElSalto(data);

      default:
        throw new Error('Panel not found');
    }
  }
}
