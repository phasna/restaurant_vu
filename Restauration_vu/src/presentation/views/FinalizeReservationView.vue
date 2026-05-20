<template>
  <AppPageLayout
    :links="mainNavLinks"
    :active-path="route.path"
    :cta-label="CTA_RESERVE_LABEL"
    @logo-click="goHome"
    @navigate="push"
    @cta-click="goReservation"
  >
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <h1 class="font-serif text-3xl text-black sm:text-4xl">
        Finaliser ma réservation
      </h1>

      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <form class="space-y-5 font-sans" @submit.prevent="onSubmit">
          <div class="grid gap-5 sm:grid-cols-2">
            <LabeledInput
              v-model="booking.customerFirstName"
              label="Prénom"
              input-id="fn"
              autocomplete="given-name"
              :error="fieldErrors.customerName"
            />
            <LabeledInput
              v-model="booking.customerLastName"
              label="Nom"
              input-id="ln"
              autocomplete="family-name"
              :error="fieldErrors.customerName"
            />
          </div>
          <LabeledInput
            v-model="booking.customerEmail"
            label="E-mail"
            input-id="em"
            type="email"
            autocomplete="email"
            :error="fieldErrors.customerEmail"
          />
          <LabeledInput
            v-model="booking.customerPhone"
            label="Téléphone"
            input-id="ph"
            type="tel"
            autocomplete="tel"
            :error="fieldErrors.customerPhone"
          />
          <div>
            <label
              for="covers"
              class="mb-1 block text-xs font-semibold uppercase tracking-wider text-black/60"
            >Nombre de personnes</label>
            <input
              id="covers"
              v-model.number="booking.covers"
              type="number"
              min="1"
              max="20"
              class="w-full border border-black/15 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            <p v-if="fieldErrors.covers" class="mt-1 text-xs text-red-700">
              {{ fieldErrors.covers }}
            </p>
          </div>
          <LabeledTextarea
            v-model="booking.specialRequest"
            label="Demandes particulières"
            input-id="rq"
            rows="4"
            placeholder="Allergies, occasion, table près de la fenêtre… (non transmis à l’API pour l’instant)"
          />

          <label class="flex items-start gap-3 text-sm text-black/80">
            <input
              v-model="booking.acceptTerms"
              type="checkbox"
              class="mt-1 size-4 border-black/30 accent-black"
            />
            <span>J’accepte les conditions générales et la politique de confidentialité.</span>
          </label>

          <button
            type="submit"
            class="bg-black px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:bg-black/40"
            :disabled="submitting"
          >
            {{ submitting ? "Envoi…" : "Confirmer la réservation" }}
          </button>
        </form>

        <BookingSummaryCard
          v-if="selectedRestaurant"
          :title="selectedRestaurant.name"
          :address="selectedRestaurant.address"
          :image-url="selectedRestaurant.imageUrl"
          :date-label="formatDateLongFr(booking.selectedDate)"
          :time-label="selectedTimeLabel"
          :covers="booking.covers"
          @modify="goSlots"
        />
      </div>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPageLayout from "@/presentation/components/layout/AppPageLayout.vue";
import LabeledInput from "@/presentation/components/forms/LabeledInput.vue";
import LabeledTextarea from "@/presentation/components/forms/LabeledTextarea.vue";
import BookingSummaryCard from "@/presentation/components/booking/BookingSummaryCard.vue";
import { mainNavLinks, CTA_RESERVE_LABEL } from "@/constants/navigation.js";
import { useBookingStore } from "@/stores/booking.js";
import { useRestaurantsStore } from "@/stores/restaurants.js";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";
import { formatDateLongFr } from "@/utils/dateDisplay.js";

const route = useRoute();
const router = useRouter();
const booking = useBookingStore();
const restaurants = useRestaurantsStore();
const flash = useFlashMessagesStore();

const submitting = ref(false);
const fieldErrors = reactive({
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  covers: "",
});

const selectedRestaurant = computed(() =>
  restaurants.getById(booking.selectedRestaurantId),
);

const selectedSlot = computed(() =>
  booking.slots.find((s) => s.id === booking.selectedSlotId),
);

const selectedTimeLabel = computed(() => {
  const s = selectedSlot.value;
  if (!s) return "—";
  return `${s.startTime} – ${s.endTime}`;
});

onMounted(async () => {
  if (
    !booking.selectedRestaurantId ||
    !booking.selectedDate ||
    !booking.selectedSlotId
  ) {
    flash.setError("Sélectionnez d’abord un créneau.");
    router.replace({
      path: "/reservation/creneau",
      query: { restaurant: booking.selectedRestaurantId || undefined },
    });
    return;
  }
  if (!restaurants.items.length) {
    await restaurants.fetchAll(flash);
  }
  if (
    booking.selectedRestaurantId &&
    booking.selectedDate &&
    booking.selectedSlotId &&
    !booking.slots.length
  ) {
    await booking.fetchSlots(flash);
  }
});

function clearFieldErrors() {
  fieldErrors.customerName = "";
  fieldErrors.customerEmail = "";
  fieldErrors.customerPhone = "";
  fieldErrors.covers = "";
}

async function onSubmit() {
  clearFieldErrors();
  if (!booking.acceptTerms) {
    flash.setError("Veuillez accepter les conditions générales.");
    return;
  }
  submitting.value = true;
  flash.clear();
  try {
    const data = await booking.submitReservation();
    flash.setSuccess(data.message ?? "Réservation confirmée.");
    booking.resetFlow();
    router.push({
      name: "reservation-confirmation",
      query: { id: data.id, token: data.token },
    });
  } catch (e) {
    if (e?.field === "customerName") fieldErrors.customerName = e.message;
    else if (e?.field === "customerEmail") fieldErrors.customerEmail = e.message;
    else if (e?.field === "customerPhone") fieldErrors.customerPhone = e.message;
    else if (e?.field === "covers") fieldErrors.covers = e.message;
    flash.setError(e.message ?? "Impossible de confirmer la réservation.");
  } finally {
    submitting.value = false;
  }
}

function goSlots() {
  router.push({
    path: "/reservation/creneau",
    query: { restaurant: booking.selectedRestaurantId },
  });
}

function push(to) {
  router.push(to);
}

function goHome() {
  router.push("/");
}

function goReservation() {
  router.push("/reservation/creneau");
}
</script>
