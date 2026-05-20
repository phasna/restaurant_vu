import "reflect-metadata";
import { DataSource } from "typeorm";
import { Restaurant } from "./entities/Restaurant";
import { TimeSlot } from "./entities/TimeSlot";
import { Reservation } from "./entities/Reservation";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  logging: false,
  entities: [Restaurant, TimeSlot, Reservation],
});
