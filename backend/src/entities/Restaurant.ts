import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TimeSlot } from "./TimeSlot";
import { Reservation } from "./Reservation";

@Entity({ name: "restaurants" })
export class Restaurant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 255 })
  name!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 512 })
  address!: string;

  @Column({ name: "cuisine_type", type: "varchar", length: 120 })
  cuisineType!: string;

  @Column({ name: "image_url", type: "varchar", length: 1024 })
  imageUrl!: string;

  @OneToMany(() => TimeSlot, (slot) => slot.restaurant)
  timeSlots!: TimeSlot[];

  @OneToMany(() => Reservation, (r) => r.restaurant)
  reservations!: Reservation[];
}
