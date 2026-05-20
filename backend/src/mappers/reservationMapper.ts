import type { Reservation } from "../entities/Reservation";
import type { ReservationResponseDto } from "../dtos";

export function toReservationResponseDto(
  reservation: Reservation,
  message: string
): ReservationResponseDto {
  return {
    id: reservation.id,
    token: reservation.token,
    status: reservation.status,
    message,
    restaurant: {
      id: reservation.restaurant.id,
      name: reservation.restaurant.name,
    },
    slot: {
      id: reservation.timeSlot.id,
      date: reservation.timeSlot.date,
      startTime: reservation.timeSlot.startTime,
      endTime: reservation.timeSlot.endTime,
    },
    covers: reservation.covers,
    customer: {
      name: reservation.customerName,
      email: reservation.customerEmail,
      phone: reservation.customerPhone,
    },
  };
}
