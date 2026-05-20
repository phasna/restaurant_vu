import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Restaurant } from "./Restaurant";
import { TimeSlot } from "./TimeSlot";

export type ReservationStatus = "confirmed" | "cancelled";

@Entity({ name: "reservations" })
export class Reservation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "restaurant_id", type: "uuid" })
  restaurantId!: string;

  @ManyToOne(() => Restaurant, (r) => r.reservations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "restaurant_id" })
  restaurant!: Restaurant;

  @Column({ name: "time_slot_id", type: "uuid" })
  timeSlotId!: string;

  @ManyToOne(() => TimeSlot, (s) => s.reservations, { onDelete: "CASCADE" })
  @JoinColumn({ name: "time_slot_id" })
  timeSlot!: TimeSlot;

  @Column({ name: "customer_name", type: "varchar", length: 255 })
  customerName!: string;

  @Column({ name: "customer_email", type: "varchar", length: 255 })
  customerEmail!: string;

  @Column({ name: "customer_phone", type: "varchar", length: 32 })
  customerPhone!: string;

  @Column({ type: "integer" })
  covers!: number;

  @Column({ type: "uuid", unique: true })
  token!: string;

  @Column({ type: "varchar", length: 20, default: "confirmed" })
  status!: ReservationStatus;
}
