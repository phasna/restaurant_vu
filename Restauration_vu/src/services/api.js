import { apiGet, apiRequest } from "./http.js";

/** @typedef {{ id: string; name: string; description: string; address: string; cuisineType: string; imageUrl: string }} Restaurant */

/** @returns {Promise<Restaurant[]>} */
export function listRestaurants() {
  return apiGet("/restaurants");
}

/** @returns {Promise<Restaurant>} */
export function getRestaurant(id) {
  return apiGet(`/restaurants/${encodeURIComponent(id)}`);
}

/**
 * @param {string} restaurantId
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<Array<{ id: string; restaurantId: string; date: string; startTime: string; endTime: string; totalCapacity: number; bookedCovers: number; status: string }>>}
 */
export function listSlots(restaurantId, date) {
  const q = new URLSearchParams({ date });
  return apiGet(
    `/restaurants/${encodeURIComponent(restaurantId)}/slots?${q.toString()}`,
  );
}

/**
 * @param {{ restaurantId: string; timeSlotId: string; customerName: string; customerEmail: string; customerPhone: string; covers: number }} body
 */
export function createReservation(body) {
  return apiRequest("/reservations", { method: "POST", body });
}

/** @param {string} token */
export function getReservationByToken(token) {
  return apiGet(
    `/reservations/by-token/${encodeURIComponent(token)}`,
  );
}

/**
 * @param {string} id
 * @param {{ token: string }} body
 */
export function cancelReservation(id, body) {
  return apiRequest(`/reservations/${encodeURIComponent(id)}/cancel`, {
    method: "PATCH",
    body,
  });
}
