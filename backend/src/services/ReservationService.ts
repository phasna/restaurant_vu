import { v4 as uuidv4 } from "uuid";
import { Reservation } from "../entities/Reservation";
import {
  ReservationRepository,
  RestaurantRepository,
  TimeSlotRepository,
} from "../repositories";
import type {
  CancelReservationBodyDto,
  CreateReservationDto,
} from "../dtos";
import { toReservationResponseDto } from "../mappers/reservationMapper";
import { AppError } from "../errors/AppError";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function assertField(cond: boolean, message: string, field: string): void {
  if (!cond) throw new AppError(400, message, field);
}

/** Reservation lifecycle: validation + persistence. */
export class ReservationService {
  constructor(
    private readonly reservations = new ReservationRepository(),
    private readonly restaurants = new RestaurantRepository(),
    private readonly slots = new TimeSlotRepository()
  ) {}

  private validateCreatePayload(body: CreateReservationDto): void {
    assertField(!!body.restaurantId?.trim(), "restaurantId is required", "restaurantId");
    assertField(!!body.timeSlotId?.trim(), "timeSlotId is required", "timeSlotId");
    assertField(!!body.customerName?.trim(), "customerName is required", "customerName");
    assertField(!!body.customerEmail?.trim(), "customerEmail is required", "customerEmail");
    assertField(
      EMAIL_REGEX.test(body.customerEmail.trim()),
      "customerEmail is invalid",
      "customerEmail"
    );
    assertField(!!body.customerPhone?.trim(), "customerPhone is required", "customerPhone");
    assertField(
      Number.isFinite(body.covers) && body.covers >= 1,
      "covers must be a positive integer",
      "covers"
    );
  }

  async createReservation(body: CreateReservationDto) {
    this.validateCreatePayload(body);

    const restaurant = await this.restaurants.findById(body.restaurantId);
    if (!restaurant) {
      throw new AppError(404, "Restaurant not found", "restaurantId");
    }

    const slot = await this.slots.findById(body.timeSlotId);
    if (!slot) {
      throw new AppError(404, "Time slot not found", "timeSlotId");
    }
    assertField(
      slot.restaurantId === body.restaurantId,
      "Time slot does not belong to this restaurant",
      "timeSlotId"
    );

    const booked = await this.reservations.sumConfirmedCoversForSlot(slot.id);
    const remaining = slot.totalCapacity - booked;
    assertField(
      body.covers <= remaining,
      `Not enough seats left (${remaining} remaining)`,
      "covers"
    );

    const entity = new Reservation();
    entity.restaurantId = restaurant.id;
    entity.timeSlotId = slot.id;
    entity.customerName = body.customerName.trim();
    entity.customerEmail = body.customerEmail.trim();
    entity.customerPhone = body.customerPhone.trim();
    entity.covers = body.covers;
    entity.token = uuidv4();
    entity.status = "confirmed";

    const saved = await this.reservations.save(entity);
    const full = await this.reservations.findById(saved.id);
    if (!full) throw new AppError(500, "Failed to load reservation after save");

    return toReservationResponseDto(
      full,
      "Votre réservation est confirmée."
    );
  }

  async getByToken(token: string) {
    assertField(!!token?.trim(), "token is required", "token");
    const res = await this.reservations.findByToken(token.trim());
    if (!res) {
      throw new AppError(404, "Reservation not found", "token");
    }
    return toReservationResponseDto(res, "Réservation trouvée.");
  }

  async cancelReservation(id: string, body: CancelReservationBodyDto) {
    assertField(!!id?.trim(), "id is required", "id");
    assertField(!!body.token?.trim(), "token is required", "token");

    const res = await this.reservations.findById(id.trim());
    if (!res) {
      throw new AppError(404, "Reservation not found", "id");
    }

    assertField(
      res.token === body.token.trim(),
      "Invalid token for this reservation",
      "token"
    );
    assertField(
      res.status === "confirmed",
      "Reservation is already cancelled",
      "status"
    );

    res.status = "cancelled";
    await this.reservations.save(res);

    const full = await this.reservations.findById(res.id);
    if (!full) throw new AppError(500, "Failed to load reservation after cancel");

    return {
      message: "C'est noté, votre réservation est bien annulée.",
      reservation: toReservationResponseDto(
        full,
        "C'est noté, votre réservation est bien annulée."
      ),
    };
  }
}
