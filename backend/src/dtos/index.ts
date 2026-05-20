/** Occupancy status for a time slot (derived from booked / capacity). */
export type SlotStatus = "free" | "nearly_full" | "full";

export interface CreateReservationDto {
  restaurantId: string;
  timeSlotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  covers: number;
}

export interface SlotResponseDto {
  id: string;
  restaurantId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalCapacity: number;
  bookedCovers: number;
  status: SlotStatus;
}

export interface ReservationCustomerDto {
  name: string;
  email: string;
  phone: string;
}

export interface ReservationResponseDto {
  id: string;
  token: string;
  status: "confirmed" | "cancelled";
  message: string;
  restaurant: { id: string; name: string };
  slot: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
  };
  covers: number;
  customer: ReservationCustomerDto;
}

export interface CancelReservationBodyDto {
  /** Must match the reservation token (ownership proof). */
  token: string;
}

export interface CancelResponseDto {
  message: string;
  reservation: ReservationResponseDto;
}

export interface ApiErrorDto {
  statusCode: number;
  message: string;
  field?: string;
}
