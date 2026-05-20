import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/services/api.js";
import { SESSION_LAST_RESERVATION } from "@/constants/storage.js";

/**
 * Parcours réservation : sélection restaurant / date / créneau + formulaire final.
 */
export const useBookingStore = defineStore("booking", () => {
  const selectedRestaurantId = ref("");
  const selectedDate = ref("");
  const selectedSlotId = ref("");
  const covers = ref(2);

  const slots = ref([]);
  const slotsLoading = ref(false);

  const customerFirstName = ref("");
  const customerLastName = ref("");
  const customerEmail = ref("");
  const customerPhone = ref("");
  const specialRequest = ref("");
  const acceptTerms = ref(false);

  function setRestaurant(id) {
    selectedRestaurantId.value = id ?? "";
    selectedSlotId.value = "";
    slots.value = [];
  }

  function setDate(isoDate) {
    selectedDate.value = isoDate ?? "";
    selectedSlotId.value = "";
  }

  function setSlot(id) {
    selectedSlotId.value = id ?? "";
  }

  async function fetchSlots(flash) {
    if (!selectedRestaurantId.value || !selectedDate.value) {
      slots.value = [];
      return;
    }
    slotsLoading.value = true;
    try {
      slots.value = await api.listSlots(
        selectedRestaurantId.value,
        selectedDate.value,
      );
      flash?.clear?.();
    } catch (e) {
      slots.value = [];
      flash?.setError?.(e.message ?? "Impossible de charger les créneaux.");
    } finally {
      slotsLoading.value = false;
    }
  }

  function resetFlow() {
    selectedRestaurantId.value = "";
    selectedDate.value = "";
    selectedSlotId.value = "";
    covers.value = 2;
    slots.value = [];
    customerFirstName.value = "";
    customerLastName.value = "";
    customerEmail.value = "";
    customerPhone.value = "";
    specialRequest.value = "";
    acceptTerms.value = false;
  }

  /**
   * Crée la réservation côté API et enregistre la réponse en session.
   * @returns {Promise<Record<string, unknown>>}
   */
  async function submitReservation() {
    const name =
      `${customerFirstName.value} ${customerLastName.value}`.trim() ||
      customerLastName.value.trim();
    const body = {
      restaurantId: selectedRestaurantId.value,
      timeSlotId: selectedSlotId.value,
      customerName: name,
      customerEmail: customerEmail.value.trim(),
      customerPhone: customerPhone.value.trim(),
      covers: Number(covers.value),
    };
    const data = await api.createReservation(body);
    try {
      sessionStorage.setItem(SESSION_LAST_RESERVATION, JSON.stringify(data));
    } catch {
      /* ignore */
    }
    return data;
  }

  return {
    selectedRestaurantId,
    selectedDate,
    selectedSlotId,
    covers,
    slots,
    slotsLoading,
    customerFirstName,
    customerLastName,
    customerEmail,
    customerPhone,
    specialRequest,
    acceptTerms,
    setRestaurant,
    setDate,
    setSlot,
    fetchSlots,
    resetFlow,
    submitReservation,
  };
});
