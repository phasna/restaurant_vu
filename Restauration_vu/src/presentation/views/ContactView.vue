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
      <h1 class="font-serif text-3xl text-black sm:text-4xl">Contact</h1>
      <p class="mt-4 max-w-2xl font-sans text-black/70">
        Une question sur nos maisons ou vos réservations ? Laissez-nous un message (simulation — pas d’envoi serveur).
      </p>

      <form class="mx-auto mt-10 max-w-xl space-y-5 font-sans" @submit.prevent="onSubmit">
        <LabeledInput v-model="name" label="Nom" input-id="c-name" autocomplete="name" />
        <LabeledInput
          v-model="email"
          label="E-mail"
          input-id="c-email"
          type="email"
          autocomplete="email"
        />
        <LabeledTextarea v-model="message" label="Message" input-id="c-msg" rows="5" />
        <button
          type="submit"
          class="bg-black px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white"
        >
          Envoyer
        </button>
      </form>
    </div>
  </AppPageLayout>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppPageLayout from "@/presentation/components/layout/AppPageLayout.vue";
import LabeledInput from "@/presentation/components/forms/LabeledInput.vue";
import LabeledTextarea from "@/presentation/components/forms/LabeledTextarea.vue";
import { mainNavLinks, CTA_RESERVE_LABEL } from "@/constants/navigation.js";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";

const router = useRouter();
const flash = useFlashMessagesStore();

const name = ref("");
const email = ref("");
const message = ref("");

function onSubmit() {
  if (!message.value.trim()) {
    flash.setError("Merci d’écrire un message.");
    return;
  }
  flash.setSuccess(`Message reçu pour ${email.value || "—"} (démo sans API).`);
  name.value = "";
  email.value = "";
  message.value = "";
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
