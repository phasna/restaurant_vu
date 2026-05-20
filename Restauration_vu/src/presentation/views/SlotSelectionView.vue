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
      <h1 class="font-serif text-3xl text-black sm:text-4xl">Choisir un créneau</h1>
      <p class="mt-2 font-sans text-sm text-black/60">
        Sélectionnez un restaurant, une date puis un horaire disponible.
      </p>

      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div>
          <div class="space-y-6">
            <div v-if="restaurants.items.length" class="font-sans">
              <label for="restaurant-select" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-black/60">Restaurant</label>
              <select
                id="restaurant-select"
                :value="booking.selectedRestaurantId"
                class="w-full border border-black/15 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                @change="onRestaurantChange($event.target.value)"
              >
                <option value="" disabled>Choisir…</option>
                <option v-for="r in restaurants.items" :key="r.id" :value="r.id">
                  {{ r.name }}
                </option>
              </select>
            </div>

            <div class="font-sans">
              <label for="date-slot" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-black/60">Date</label>
              <input
                id="date-slot"
                v-model="dateModel"
                type="date"
                :min="minDate"
                :max="maxDate"
                class="w-full border border-black/15 bg-white px-3 py-2.5 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div class="mt-8">
            <p class="font-sans text-xs font-semibold uppercase tracking-wider text-black/50">
              Créneaux
            </p>
            <div v-if="booking.slotsLoading" class="mt-4 font-sans text-sm text-black/50">
              Chargement des créneaux…
            </div>
            <div v-else-if="!booking.selectedRestaurantId" class="mt-4 text-sm text-black/50">
              Choisissez d’abord un restaurant.
            </div>
            <div v-else-if="!booking.slots.length" class="mt-4 text-sm text-black/50">
              Aucun créneau pour cette date.
            </div>
            <TimeSlotGrid
              v-else
              v-model="slotModel"
              class="mt-4"
              :slots="booking.slots"
            />
          </div>

          <button
            type="button"
            class="mt-10 bg-black px-8 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:bg-black/30"
            :disabled="!canContinue"
            @click="confirmSelection"
          >
            Confirmer la sélection
          </button>
        </div>

        <BookingSummaryCard
          v-if="selectedRestaurant"
          :title="selectedRestaurant.name"
          :address="selectedRestaurant.address"
          :image-url="selectedRestaurant.imageUrl"
          :date-label="formatDateLongFr(booking.selectedDate)"
          :time-label="selectedTimeLabel"
          :covers="booking.covers"
          @modify="goEditRestaurant"
        />
      </div>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPageLayout from "@/presentation/components/layout/AppPageLayout.vue";
import TimeSlotGrid from "@/presentation/components/booking/TimeSlotGrid.vue";
import BookingSummaryCard from "@/presentation/components/booking/BookingSummaryCard.vue";
import { mainNavLinks, CTA_RESERVE_LABEL } from "@/constants/navigation.js";
import { useRestaurantsStore } from "@/stores/restaurants.js";
import { useBookingStore } from "@/stores/booking.js";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";
import {
  addDaysIsoLocal,
  formatDateLongFr,
  todayIsoLocal,
} from "@/utils/dateDisplay.js";

const route = useRoute();
const router = useRouter();
const restaurants = useRestaurantsStore();
const booking = useBookingStore();
const flash = useFlashMessagesStore();

const minDate = todayIsoLocal();
const maxDate = addDaysIsoLocal(minDate, 30);

const dateModel = ref(booking.selectedDate || minDate);

const slotModel = computed({
  get: () => booking.selectedSlotId,
  set: (v) => booking.setSlot(v),
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

const canContinue = computed(
  () =>
    !!booking.selectedRestaurantId &&
    !!booking.selectedDate &&
    !!booking.selectedSlotId,
);

onMounted(async () => {
  await restaurants.fetchAll(flash);
  const qId = route.query.restaurant;
  const first = restaurants.items[0]?.id;
  const initial = (typeof qId === "string" && qId) || first || "";
  booking.setRestaurant(initial);
  if (!booking.selectedDate) {
    booking.setDate(minDate);
    dateModel.value = minDate;
  } else {
    dateModel.value = booking.selectedDate;
  }
  await booking.fetchSlots(flash);
});

watch(dateModel, async (v) => {
  booking.setDate(v);
  if (booking.selectedRestaurantId) {
    await booking.fetchSlots(flash);
  }
});

watch(
  () => booking.selectedRestaurantId,
  async (id) => {
    if (id && booking.selectedDate) {
      await booking.fetchSlots(flash);
    }
  },
);

function onRestaurantChange(id) {
  booking.setRestaurant(id);
}

async function confirmSelection() {
  if (!canContinue.value) return;
  flash.clear();
  router.push("/reservation/finalisation");
}

function goEditRestaurant() {
  router.push("/etablissements");
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
