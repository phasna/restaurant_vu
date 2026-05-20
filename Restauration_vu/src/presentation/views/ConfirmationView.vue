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
      <div
        v-if="loading"
        class="font-sans text-sm text-black/50"
      >
        Chargement…
      </div>

      <template v-else-if="reservation">
        <div class="flex items-start gap-4">
          <span
            class="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-black font-serif text-2xl"
            aria-hidden="true"
          >✓</span>
          <div>
            <h1 class="font-serif text-3xl text-black sm:text-4xl">
              Merci pour votre confiance
            </h1>
            <p class="mt-3 max-w-2xl font-sans text-base text-black/70">
              Votre réservation est enregistrée. Conservez le lien ci-dessous (ou le token) pour consulter ou annuler votre réservation : il n’y a pas d’e-mail de confirmation dans ce parcours.
            </p>
          </div>
        </div>

        <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div class="border border-black/10 bg-neutral-50 p-6 font-sans">
            <h2 class="text-xs font-semibold uppercase tracking-widest text-black/50">
              Détails
            </h2>
            <dl class="mt-4 space-y-3 text-sm">
              <div class="flex justify-between gap-4 border-b border-black/10 pb-2">
                <dt class="text-black/50">Référence</dt>
                <dd class="font-mono text-xs">{{ reservation.id }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-black/10 pb-2">
                <dt class="text-black/50">Token privé</dt>
                <dd class="max-w-[12rem] truncate font-mono text-xs" :title="reservation.token">
                  {{ reservation.token }}
                </dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-black/10 pb-2">
                <dt class="text-black/50">Restaurant</dt>
                <dd class="font-medium">{{ reservation.restaurant?.name }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-black/10 pb-2">
                <dt class="text-black/50">Date</dt>
                <dd>{{ formatDateLongFr(reservation.slot?.date) }}</dd>
              </div>
              <div class="flex justify-between gap-4 border-b border-black/10 pb-2">
                <dt class="text-black/50">Heure</dt>
                <dd>{{ reservation.slot?.startTime }} – {{ reservation.slot?.endTime }}</dd>
              </div>
              <div class="flex justify-between gap-4">
                <dt class="text-black/50">Personnes</dt>
                <dd>{{ reservation.covers }}</dd>
              </div>
            </dl>
            <div class="mt-4 space-y-2">
              <p class="text-xs font-semibold uppercase tracking-wider text-black/50">
                Lien direct (gestion / annulation)
              </p>
              <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  readonly
                  class="min-w-0 flex-1 border border-black/15 bg-white px-3 py-2 font-mono text-xs"
                  :value="manageUrl"
                />
                <button
                  type="button"
                  class="shrink-0 border border-black bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
                  @click="copyManageUrl"
                >
                  Copier le lien
                </button>
              </div>
              <p class="text-xs text-black/50">
                Vous pouvez aussi coller uniquement le token sur la page « Gérer ma réservation ».
              </p>
            </div>
          </div>

          <div class="space-y-6">
            <div class="border border-black/10 p-6">
              <h2 class="font-serif text-lg text-black">Préférences et retours</h2>
              <textarea
                v-model="feedback"
                rows="4"
                class="mt-3 w-full border border-black/15 px-3 py-2 text-sm focus:border-black focus:outline-none"
                placeholder="Comment s’est passée votre réservation ?"
              />
              <button
                type="button"
                class="mt-4 w-full bg-black py-2 text-xs font-semibold uppercase tracking-wider text-white"
                @click="sendFeedback"
              >
                Envoyer mon avis
              </button>
            </div>
            <div class="aspect-video w-full overflow-hidden bg-neutral-100 ring-1 ring-black/10">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
                alt=""
                class="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div class="mt-10 flex flex-wrap gap-4">
          <RouterLink
            to="/"
            class="border border-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black"
          >
            Retour à l’accueil
          </RouterLink>
          <RouterLink
            :to="{ path: '/ma-reservation', query: reservation?.token ? { token: reservation.token } : {} }"
            class="bg-black px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white"
          >
            Gérer ma réservation
          </RouterLink>
        </div>
      </template>

      <p v-else class="font-sans text-black/60">
        Aucune donnée de confirmation. Repassez par la page de finalisation ou saisissez votre token sur « Mes Réservations ».
      </p>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import AppPageLayout from "@/presentation/components/layout/AppPageLayout.vue";
import { mainNavLinks, CTA_RESERVE_LABEL } from "@/constants/navigation.js";
import { SESSION_LAST_RESERVATION } from "@/constants/storage.js";
import * as api from "@/services/api.js";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";
import { formatDateLongFr } from "@/utils/dateDisplay.js";

const route = useRoute();
const router = useRouter();
const flash = useFlashMessagesStore();

const reservation = ref(null);
const loading = ref(true);
const feedback = ref("");

const manageUrl = computed(() => {
  const t = reservation.value?.token;
  if (!t || typeof window === "undefined") return "";
  const basePath = import.meta.env.BASE_URL || "/";
  const root = `${window.location.origin}${basePath.endsWith("/") ? basePath.slice(0, -1) : basePath}`;
  return `${root}/ma-reservation?token=${encodeURIComponent(t)}`;
});

async function copyManageUrl() {
  const url = manageUrl.value;
  if (!url) return;
  try {
    await navigator.clipboard.writeText(url);
    flash.setSuccess("Lien copié dans le presse-papiers.");
  } catch {
    flash.setError("Copie impossible : sélectionnez le lien manuellement.");
  }
}

onMounted(async () => {
  const token = typeof route.query.token === "string" ? route.query.token : "";
  loading.value = true;
  try {
    if (token) {
      reservation.value = await api.getReservationByToken(token);
    } else {
      const raw = sessionStorage.getItem(SESSION_LAST_RESERVATION);
      reservation.value = raw ? JSON.parse(raw) : null;
    }
    flash.clear();
  } catch (e) {
    reservation.value = null;
    flash.setError(e.message ?? "Impossible de charger la réservation.");
  } finally {
    loading.value = false;
  }
});

function sendFeedback() {
  if (!feedback.value.trim()) {
    flash.setError("Écrivez un court message avant d’envoyer.");
    return;
  }
  flash.setSuccess("Merci ! Votre retour a été enregistré (hors API — maquette).");
  feedback.value = "";
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
