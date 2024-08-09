import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Panel } from './panel.entity';

@Entity({ name: 'availableYears' })
export class AvailableYears {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  year: number;

  @ManyToOne(() => Panel, (panel) => panel.availableYears)
  @JoinColumn()
  panel: Panel;
}
