import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Panel } from 'src/entities/panel.entity';
import { Pvsyst } from 'src/entities/pvsyst.entity';
import {
  pvsystCentrovet,
  pvsystCentrovet601,
  pvsystBS,
  pvsystEnokoElSalto,
} from 'src/utils/pvsyst';
import { Repository } from 'typeorm';

@Injectable()
export class pvsystPreloadRepository {
  constructor(
    @InjectRepository(Pvsyst)
    private readonly pvsystRepository: Repository<Pvsyst>,
    @InjectRepository(Panel)
    private readonly panelRepository: Repository<Panel>,
  ) {}

  async pvsystBodegasSalcobrand(data?: any) {
    if (data) {
      const panel = await this.panelRepository.findOne({
        where: { name: data.panel },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      const newPvsyst = this.pvsystRepository.create({
        month: data.month,
        year: data.year,
        estimatedGeneration: data.estimatedGeneration,
        panel: panel,
      });
      await this.pvsystRepository.save(newPvsyst);
    } else {
      const panel = await this.panelRepository.findOne({
        where: { name: 'PLANT N1' },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      for (const pvsyst of pvsystBS) {
        const newPvsyst = this.pvsystRepository.create({
          month: pvsyst.month,
          year: pvsyst.year,
          estimatedGeneration: pvsyst.estimatedGeneration,
          panel: panel,
        });
        await this.pvsystRepository.save(newPvsyst);
      }
    }
  }

  async pvsystCentrovet(data?: any) {
    if (data) {
      console.log('hola');

      const panel = await this.panelRepository.findOne({
        where: { name: data.panel },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      const newPvsyst = this.pvsystRepository.create({
        month: data.month,
        year: data.year,
        estimatedGeneration: data.estimatedGeneration,
        panel: panel,
      });
      await this.pvsystRepository.save(newPvsyst);
    } else {
      const panel = await this.panelRepository.findOne({
        where: { name: 'PLANT N2' },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      for (const pvsyst of pvsystCentrovet) {
        const newPvsyst = this.pvsystRepository.create({
          month: pvsyst.month,
          year: pvsyst.year,
          estimatedGeneration: pvsyst.estimatedGeneration,
          panel: panel,
        });
        await this.pvsystRepository.save(newPvsyst);
      }
    }
  }

  async pvsystCentrovet601(data?: any) {
    if (data) {
      const panel = await this.panelRepository.findOne({
        where: { name: data.panel },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      const newPvsyst = this.pvsystRepository.create({
        month: data.month,
        year: data.year,
        estimatedGeneration: data.estimatedGeneration,
        panel: panel,
      });
      await this.pvsystRepository.save(newPvsyst);
    } else {
      const panel = await this.panelRepository.findOne({
        where: { name: 'PLANT N3' },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      for (const pvsyst of pvsystCentrovet601) {
        const newPvsyst = this.pvsystRepository.create({
          month: pvsyst.month,
          year: pvsyst.year,
          estimatedGeneration: pvsyst.estimatedGeneration,
          panel: panel,
        });
        await this.pvsystRepository.save(newPvsyst);
      }
    }
  }

  async pvsystEnokoElSalto(data?: any) {
    if (data) {
      const panel = await this.panelRepository.findOne({
        where: { name: data.panel },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      const newPvsyst = this.pvsystRepository.create({
        month: data.month,
        year: data.year,
        estimatedGeneration: data.estimatedGeneration,
        panel: panel,
      });
      await this.pvsystRepository.save(newPvsyst);
    } else {
      const panel = await this.panelRepository.findOne({
        where: { name: 'PLANT N4' },
      });
      if (!panel) {
        throw new Error('Panel not found');
      }

      for (const pvsyst of pvsystEnokoElSalto) {
        const newPvsyst = this.pvsystRepository.create({
          month: pvsyst.month,
          year: pvsyst.year,
          estimatedGeneration: pvsyst.estimatedGeneration,
          panel: panel,
        });
        await this.pvsystRepository.save(newPvsyst);
      }
    }
  }
}
