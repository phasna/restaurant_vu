import {
  RestaurantRepository,
  TimeSlotRepository,
  ReservationRepository,
} from "../repositories";
import { computeSlotStatus } from "./slotStatus";
import type { SlotResponseDto } from "../dtos";
import { AppError } from "../errors/AppError";

/** Restaurant + slot listing use-cases. */
export class RestaurantService {
  constructor(
    private readonly restaurants = new RestaurantRepository(),
    private readonly slots = new TimeSlotRepository(),
    private readonly reservations = new ReservationRepository()
  ) {}

  listRestaurants() {
    return this.restaurants.findAll();
  }

  getRestaurant(id: string) {
    return this.restaurants.findById(id);
  }

  async listSlotsForDate(
    restaurantId: string,
    date: string
  ): Promise<SlotResponseDto[]> {
    const restaurant = await this.restaurants.findById(restaurantId);
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found", "restaurantId");
    }

    const slots = await this.slots.findByRestaurantAndDate(restaurantId, date);
    const result: SlotResponseDto[] = [];

    for (const slot of slots) {
      const bookedCovers = await this.reservations.sumConfirmedCoversForSlot(
        slot.id
      );
      result.push({
        id: slot.id,
        restaurantId: slot.restaurantId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        totalCapacity: slot.totalCapacity,
        bookedCovers,
        status: computeSlotStatus(bookedCovers, slot.totalCapacity),
      });
    }

    return result;
  }
}
