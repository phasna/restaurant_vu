import { defineStore } from "pinia";
import { ref } from "vue";
import * as api from "@/services/api.js";

export const useRestaurantsStore = defineStore("restaurants", () => {
  const items = ref([]);
  const loading = ref(false);

  function getById(id) {
    return items.value.find((r) => r.id === id) ?? null;
  }

  async function fetchAll(flash) {
    loading.value = true;
    try {
      items.value = await api.listRestaurants();
      flash?.clear?.();
    } catch (e) {
      items.value = [];
      flash?.setError?.(e.message ?? "Impossible de charger les restaurants.");
    } finally {
      loading.value = false;
    }
  }

  return { items, loading, fetchAll, getById };
});
