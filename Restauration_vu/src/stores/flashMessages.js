import { defineStore } from "pinia";
import { ref } from "vue";

/**
 * Agrège les retours utilisateur (succès / erreur API).
 * Les vues appellent les actions ; les composants affichent via props ou inject si besoin.
 */
export const useFlashMessagesStore = defineStore("flashMessages", () => {
  const successMessage = ref("");
  const errorMessage = ref("");

  function setSuccess(message) {
    successMessage.value = message ?? "";
    errorMessage.value = "";
  }

  function setError(message) {
    errorMessage.value = message ?? "";
    successMessage.value = "";
  }

  function clear() {
    successMessage.value = "";
    errorMessage.value = "";
  }

  return {
    successMessage,
    errorMessage,
    setSuccess,
    setError,
    clear,
  };
});
