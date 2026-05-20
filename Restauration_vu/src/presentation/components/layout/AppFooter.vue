<template>
  <footer class="border-t border-black/10 bg-neutral-50">
    <div
      class="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:items-start lg:justify-between lg:px-8"
    >
      <p class="font-serif text-lg tracking-[0.12em] text-black uppercase">
        {{ brand }}
      </p>
      <nav class="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-black/70">
        <RouterLink
          v-for="link in legalLinks"
          :key="link.to"
          :to="link.to"
          class="hover:text-black"
        >
          {{ link.label }}
        </RouterLink>
      </nav>
      <p class="font-sans text-xs text-black/50">
        © {{ year }} L'ESSENCE — Tous droits réservés.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  brand: { type: String, default: "L'ESSENCE" },
});

const year = new Date().getFullYear();

const legalLinks = [
  { label: "Confidentialité", to: "/contact" },
  { label: "Mentions légales", to: "/contact" },
  { label: "Cookies", to: "/contact" },
];
</script>
