import { AppDataSource } from "../data-source";
import { Restaurant } from "../entities/Restaurant";
import { TimeSlot } from "../entities/TimeSlot";
import { Reservation } from "../entities/Reservation";

export class RestaurantRepository {
  private get repo() {
    return AppDataSource.getRepository(Restaurant);
  }

  findAll(): Promise<Restaurant[]> {
    return this.repo.find({ order: { name: "ASC" } });
  }

  findById(id: string): Promise<Restaurant | null> {
    return this.repo.findOne({ where: { id } });
  }
}

export class TimeSlotRepository {
  private get repo() {
    return AppDataSource.getRepository(TimeSlot);
  }

  findByRestaurantAndDate(
    restaurantId: string,
    date: string
  ): Promise<TimeSlot[]> {
    return this.repo.find({
      where: { restaurantId, date },
      order: { startTime: "ASC" },
    });
  }

  findById(id: string): Promise<TimeSlot | null> {
    return this.repo.findOne({ where: { id } });
  }
}

export class ReservationRepository {
  private get repo() {
    return AppDataSource.getRepository(Reservation);
  }

  async sumConfirmedCoversForSlot(timeSlotId: string): Promise<number> {
    const raw = await this.repo
      .createQueryBuilder("r")
      .select("COALESCE(SUM(r.covers), 0)", "sum")
      .where("r.time_slot_id = :timeSlotId", { timeSlotId })
      .andWhere("r.status = :status", { status: "confirmed" })
      .getRawOne<{ sum: string }>();
    return Number(raw?.sum ?? 0);
  }

  save(reservation: Reservation): Promise<Reservation> {
    return this.repo.save(reservation);
  }

  findByToken(token: string): Promise<Reservation | null> {
    return this.repo.findOne({
      where: { token },
      relations: ["restaurant", "timeSlot"],
    });
  }

  findById(id: string): Promise<Reservation | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["restaurant", "timeSlot"],
    });
  }
}
