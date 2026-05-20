import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant";
import { Reservation } from "./Reservation";

@Entity({ name: "time_slots" })
export class TimeSlot {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "restaurant_id", type: "uuid" })
  restaurantId!: string;

  @ManyToOne(() => Restaurant, (r) => r.timeSlots, { onDelete: "CASCADE" })
  @JoinColumn({ name: "restaurant_id" })
  restaurant!: Restaurant;

  @Column({ type: "varchar", length: 10 })
  date!: string;

  @Column({ name: "start_time", type: "varchar", length: 5 })
  startTime!: string;

  @Column({ name: "end_time", type: "varchar", length: 5 })
  endTime!: string;

  @Column({ name: "total_capacity", type: "integer" })
  totalCapacity!: number;

  @OneToMany(() => Reservation, (r) => r.timeSlot)
  reservations!: Reservation[];
}
