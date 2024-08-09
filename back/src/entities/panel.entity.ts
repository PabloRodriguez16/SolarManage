import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Stats } from './stats.entity';
import { Pvsyst } from './pvsyst.entity';
import { AvailableYears } from './availableYears.entity';

@Entity({ name: 'panel' })
export class Panel {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  name: string;

  @Column()
  inversor: string;

  @Column()
  address: string;

  @OneToMany(() => Stats, (stat) => stat.panel)
  @JoinColumn()
  stats: Stats[];

  @OneToMany(() => Pvsyst, (pvsyst) => pvsyst.panel)
  @JoinColumn()
  pvsyst: Pvsyst[];

  @OneToMany(() => AvailableYears, (availableYears) => availableYears.panel)
  availableYears: AvailableYears[];
}
