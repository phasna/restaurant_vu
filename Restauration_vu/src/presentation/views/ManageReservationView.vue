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
        Gérer ma réservation
      </h1>
      <p class="mt-2 font-mono text-sm text-black/50">
        Réf. token (UUID) reçu à la confirmation
      </p>

      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div class="space-y-8">
          <form class="flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="onLoad">
            <div class="min-w-0 flex-1 font-sans">
              <label for="token-in" class="mb-1 block text-xs font-semibold uppercase tracking-wider text-black/60">Token</label>
              <input
                id="token-in"
                v-model="tokenInput"
                type="text"
                autocomplete="off"
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                class="w-full border border-black/15 px-3 py-2.5 font-mono text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <button
              type="submit"
              class="bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white disabled:bg-black/40"
              :disabled="reservationStore.loading"
            >
              Charger
            </button>
          </form>

          <div v-if="reservationStore.current" class="space-y-8">
            <section class="border border-black/10 bg-neutral-50 p-6 font-sans">
              <h2 class="text-xs font-semibold uppercase tracking-widest text-black/50">
                Récapitulatif
              </h2>
              <p class="mt-2 font-serif text-xl text-black">
                {{ reservationStore.current.restaurant?.name }}
              </p>
              <p class="mt-1 text-sm text-black/60">
                {{ restaurantAddress }}
              </p>
              <dl class="mt-4 space-y-2 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="text-black/50">Date</dt>
                  <dd>{{ formatDateLongFr(reservationStore.current.slot?.date) }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-black/50">Heure</dt>
                  <dd>
                    {{ reservationStore.current.slot?.startTime }} – {{ reservationStore.current.slot?.endTime }}
                  </dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-black/50">Personnes</dt>
                  <dd>{{ reservationStore.current.covers }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="text-black/50">Statut</dt>
                  <dd class="uppercase">{{ reservationStore.current.status }}</dd>
                </div>
              </dl>
            </section>

            <section class="border border-black/10 p-6">
              <h2 class="font-serif text-lg text-black">Modifier les détails</h2>
              <p class="mt-2 text-sm leading-relaxed text-black/60">
                L’API actuelle ne permet pas de changer la date ou l’heure d’une réservation existante. Annulez cette réservation puis créez-en une nouvelle depuis « Réserver une table ».
              </p>
            </section>

            <section class="border-2 border-red-600/40 p-6">
              <h2 class="text-sm font-semibold uppercase tracking-wider text-red-800">
                Zone sensible
              </h2>
              <p class="mt-2 text-sm text-black/70">
                L’annulation est définitive. Les places seront à nouveau proposées aux autres clients.
              </p>
              <button
                type="button"
                class="mt-4 border border-red-700 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-red-800 hover:bg-red-50 disabled:opacity-50"
                :disabled="reservationStore.loading || reservationStore.current.status !== 'confirmed'"
                @click="onCancel"
              >
                Annuler ma réservation
              </button>
            </section>
          </div>
        </div>

        <aside class="border border-black/10 bg-white p-6 font-sans text-sm">
          <h2 class="font-serif text-lg text-black">Besoin d’aide ?</h2>
          <p class="mt-3 text-black/70">
            Écrivez-nous à
            <a class="underline" href="mailto:contact@lessence.fr">contact@lessence.fr</a>
            ou appelez le restaurant concerné.
          </p>
        </aside>
      </div>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPageLayout from "@/presentation/components/layout/AppPageLayout.vue";
import { mainNavLinks, CTA_RESERVE_LABEL } from "@/constants/navigation.js";
import { useReservationStore } from "@/stores/reservation.js";
import { useRestaurantsStore } from "@/stores/restaurants.js";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";
import { formatDateLongFr } from "@/utils/dateDisplay.js";

const route = useRoute();
const router = useRouter();
const reservationStore = useReservationStore();
const restaurants = useRestaurantsStore();
const flash = useFlashMessagesStore();

const tokenInput = ref(
  typeof route.query.token === "string" ? route.query.token : "",
);

const restaurantAddress = computed(() => {
  const id = reservationStore.current?.restaurant?.id;
  if (!id) return "";
  return restaurants.getById(id)?.address ?? "";
});

onMounted(async () => {
  await restaurants.fetchAll(flash);
  const q = typeof route.query.token === "string" ? route.query.token.trim() : "";
  if (q) {
    tokenInput.value = q;
    await reservationStore.loadByToken(q, flash);
  }
});

async function onLoad() {
  await reservationStore.loadByToken(tokenInput.value, flash);
}

async function onCancel() {
  if (!window.confirm("Confirmer l’annulation de cette réservation ?")) return;
  await reservationStore.cancelCurrent(flash);
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
