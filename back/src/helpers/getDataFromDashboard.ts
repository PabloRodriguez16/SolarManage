import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Panel } from 'src/entities/panel.entity';
import { Stats } from 'src/entities/stats.entity';
import { Pvsyst } from 'src/entities/pvsyst.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PanelRepository } from 'src/repositories/panel.repository';
import { AvailableYears } from 'src/entities/availableYears.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
    @InjectRepository(Pvsyst)
    private readonly pvsystRepository: Repository<Pvsyst>,
    @InjectRepository(AvailableYears)
    private readonly availableYearsRepository: Repository<AvailableYears>,
  ) {}

  async dataForDashboard(name: string, month?: number, year?: number) {
    const panel = await this.panelRepository.findOne({
      where: { name },
      relations: ['stats', 'pvsyst'],
    });

    if (!panel) {
      throw new NotFoundException('Panel not found');
    }

    if (!year || !month) {
      const stats = panel.stats;
      if (stats.length === 0) {
        throw new NotFoundException('No statistics found');
      }

      year = Math.max(...stats.map((stat) => stat.year));
      const statsForYear = stats.filter((stat) => stat.year === year);
      month = Math.max(...statsForYear.map((stat) => stat.month));
    }

    const highestMonth = Math.max(
      ...panel.stats
        .filter((stat) => stat.year === year)
        .map((stat) => stat.month),
    );

    const filteredStatsCurrentYear = panel.stats.filter(
      (stat) => stat.year === year,
    );
    const filteredStatsPreviousYear = panel.stats.filter(
      (stat) => stat.year === year - 1,
    );

    const filteredPvsystCurrentYear = panel.pvsyst.filter(
      (pvsyst) => pvsyst.year === year,
    );
    const filteredPvsystPreviousYear = panel.pvsyst.filter(
      (pvsyst) => pvsyst.year === year - 1,
    );

    const dia_a_dia = filteredStatsCurrentYear
      .filter((stat) => stat.month === month)
      .map((stat) => ({
        dia: stat.day,
        energiaGenerada: stat.energyGenerated,
      }));

    const energiaAcumuladaPorMes = {};
    filteredStatsCurrentYear.forEach((stat) => {
      if (!energiaAcumuladaPorMes[stat.month]) {
        energiaAcumuladaPorMes[stat.month] = {
          energiaGeneradaAcumulada: 0,
          pvsyst: 0,
        };
      }
      energiaAcumuladaPorMes[stat.month].energiaGeneradaAcumulada +=
        stat.energyGenerated;
    });

    filteredPvsystCurrentYear.forEach((pvsyst) => {
      if (!energiaAcumuladaPorMes[pvsyst.month]) {
        energiaAcumuladaPorMes[pvsyst.month] = {
          energiaGeneradaAcumulada: 0,
          pvsyst: 0,
        };
      }
      energiaAcumuladaPorMes[pvsyst.month].pvsyst = pvsyst.estimatedGeneration;
    });

    const mes_a_mes = Array.from({ length: highestMonth }, (_, i) => i + 1)
      .map((monthIndex) => ({
        mes: monthIndex,
        energiaGeneradaAcumulada: parseFloat(
          (
            energiaAcumuladaPorMes[monthIndex]?.energiaGeneradaAcumulada || 0
          ).toFixed(1),
        ),
        pvsyst: energiaAcumuladaPorMes[monthIndex]?.pvsyst || 0,
      }))
      .filter(
        (entry) => entry.energiaGeneradaAcumulada > 0 || entry.pvsyst > 0,
      );

    let energiaGeneradaAnual = 0;
    let pvsystAnual = 0;

    filteredStatsCurrentYear
      .filter((stat) => stat.month <= highestMonth)
      .forEach((stat) => {
        energiaGeneradaAnual += stat.energyGenerated;
      });

    filteredPvsystCurrentYear
      .filter((pvsyst) => pvsyst.month <= highestMonth)
      .forEach((pvsyst) => {
        pvsystAnual += pvsyst.estimatedGeneration;
      });

    energiaGeneradaAnual = parseFloat(energiaGeneradaAnual.toFixed(1));
    pvsystAnual = parseFloat(pvsystAnual.toFixed(1));

    let energiaGeneradaAnualAnterior = 0;
    let pvsystAnualAnterior = 0;

    filteredStatsPreviousYear
      .filter((stat) => stat.month <= highestMonth)
      .forEach((stat) => {
        energiaGeneradaAnualAnterior += stat.energyGenerated;
      });

    filteredPvsystPreviousYear
      .filter((pvsyst) => pvsyst.month <= highestMonth)
      .forEach((pvsyst) => {
        pvsystAnualAnterior += pvsyst.estimatedGeneration;
      });

    energiaGeneradaAnualAnterior = parseFloat(
      energiaGeneradaAnualAnterior.toFixed(1),
    );
    pvsystAnualAnterior = parseFloat(pvsystAnualAnterior.toFixed(1));

    let energiaGeneradaMesAnterior = 0;
    let pvsystMesAnterior = 0;

    filteredStatsPreviousYear
      .filter((stat) => stat.month === month)
      .forEach((stat) => {
        energiaGeneradaMesAnterior += stat.energyGenerated;
      });

    filteredPvsystPreviousYear
      .filter((pvsyst) => pvsyst.month === month)
      .forEach((pvsyst) => {
        pvsystMesAnterior += pvsyst.estimatedGeneration;
      });

    energiaGeneradaMesAnterior = parseFloat(
      energiaGeneradaMesAnterior.toFixed(1),
    );
    pvsystMesAnterior = parseFloat(pvsystMesAnterior.toFixed(1));

    const dataMes = mes_a_mes.find((mes) => mes.mes === month);

    if (!dataMes) {
      return { respuesta: 'No data found for this month' };
    }
    const mesVsPvsystActual = parseFloat(
      ((dataMes.energiaGeneradaAcumulada * 100) / dataMes.pvsyst).toFixed(1),
    );
    const mesVsGeneradaAnterior = parseFloat(
      (
        (dataMes.energiaGeneradaAcumulada * 100) /
        energiaGeneradaMesAnterior
      ).toFixed(1),
    );

    const añoVsPvsystActual = parseFloat(
      ((energiaGeneradaAnual * 100) / pvsystAnual).toFixed(1),
    );
    const añoVsGeneradaAnterior = parseFloat(
      ((energiaGeneradaAnual * 100) / energiaGeneradaAnualAnterior).toFixed(1),
    );

    const availableYears = await this.getAvailableYears(name);

    return {
      dia_a_dia,
      mes_a_mes,
      energíaMesActual: dataMes.energiaGeneradaAcumulada,
      mesVsPvsystActual,
      mesVsGeneradaAnterior,
      energíaAnualActual: energiaGeneradaAnual,
      añoVsPvsystActual,
      añoVsGeneradaAnterior,
      inversor: panel.inversor,
      address: panel.address,
      availableYears,
    };
  }

  async getAvailableYears(nameOfPanel: string): Promise<number[]> {
    const panel = await this.panelRepository.findOne({
      where: { name: nameOfPanel },
    });

    const availableYears = await this.availableYearsRepository.find({
      where: { panel: panel },
    });

    const arrayOfAvailableYears = availableYears.map(
      (availableYear) => availableYear.year,
    );

    return arrayOfAvailableYears;
  }
}
