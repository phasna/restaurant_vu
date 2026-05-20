<template>
  <div class="min-h-screen bg-white text-black">
    <AppNavBar
      :brand="brand"
      :links="links"
      :active-path="activePath"
      :cta-label="ctaLabel"
      @logo-click="$emit('logo-click')"
      @navigate="$emit('navigate', $event)"
      @cta-click="$emit('cta-click')"
    />
    <FlashBanner
      :success="successMessage"
      :error="errorMessage"
      @dismiss="flash.clear()"
    />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import AppNavBar from "@/presentation/components/layout/AppNavBar.vue";
import AppFooter from "@/presentation/components/layout/AppFooter.vue";
import FlashBanner from "@/presentation/components/feedback/FlashBanner.vue";
import { useFlashMessagesStore } from "@/stores/flashMessages.js";

defineProps({
  brand: { type: String, default: "L'ESSENCE" },
  links: { type: Array, required: true },
  activePath: { type: String, required: true },
  ctaLabel: { type: String, default: "Réserver une table" },
});

defineEmits(["logo-click", "navigate", "cta-click"]);

const flash = useFlashMessagesStore();
const { successMessage, errorMessage } = storeToRefs(flash);
</script>
