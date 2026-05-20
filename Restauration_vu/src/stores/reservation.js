import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/services/api.js";

/** Consultation / annulation via token (GET + PATCH cancel). */
export const useReservationStore = defineStore("reservation", () => {
  const current = ref(null);
  const loading = ref(false);

  function clear() {
    current.value = null;
  }

  async function loadByToken(token, flash) {
    const t = token?.trim();
    if (!t) {
      flash?.setError?.("Indiquez un token de réservation.");
      return null;
    }
    loading.value = true;
    try {
      current.value = await api.getReservationByToken(t);
      flash?.clear?.();
      return current.value;
    } catch (e) {
      current.value = null;
      flash?.setError?.(e.message ?? "Réservation introuvable.");
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function cancelCurrent(flash) {
    if (!current.value?.id || !current.value?.token) {
      flash?.setError?.("Aucune réservation chargée.");
      return null;
    }
    loading.value = true;
    try {
      const res = await api.cancelReservation(current.value.id, {
        token: current.value.token,
      });
      current.value = res.reservation;
      flash?.setSuccess?.(res.message ?? "Réservation annulée.");
      return res;
    } catch (e) {
      flash?.setError?.(e.message ?? "Annulation impossible.");
      return null;
    } finally {
      loading.value = false;
    }
  }

  return { current, loading, clear, loadByToken, cancelCurrent };
});
