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
      <h1 class="font-serif text-3xl text-black sm:text-4xl">Nos Établissements</h1>
      <p class="mt-4 max-w-2xl font-sans text-base leading-relaxed text-black/70">
        Découvrez nos maisons partenaires et réservez votre table en quelques clics.
      </p>

      <div v-if="restaurants.loading" class="mt-12 font-sans text-sm text-black/50">
        Chargement…
      </div>
      <div v-else class="mt-12">
        <EstablishmentRow
          v-for="r in restaurants.items"
          :key="r.id"
          :restaurant="r"
          @discover="onDiscover"
          @reserve="onReserve"
        />
      </div>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppPageLayout from "@/presentation/components/layout/AppPageLayout.vue";
import EstablishmentRow from "@/presentation/components/establishments/EstablishmentRow.vue";
import { mainNavLinks, CTA_RESERVE_LABEL } from "@/constants/navigation.js";
import { useRestaurantsStore } from "@/stores/restaurants.js";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";

const route = useRoute();
const router = useRouter();
const restaurants = useRestaurantsStore();
const flash = useFlashMessagesStore();

onMounted(() => {
  restaurants.fetchAll(flash);
});

function push(to) {
  router.push(to);
}

function goHome() {
  router.push("/");
}

function goReservation() {
  router.push("/reservation/creneau");
}

function onDiscover(id) {
  flash.setSuccess(`Fiche « ${id} » : contenu détaillé à enrichir.`);
}

function onReserve(id) {
  router.push({ path: "/reservation/creneau", query: { restaurant: id } });
}
</script>
