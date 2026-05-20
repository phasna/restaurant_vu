<template>
  <span
    class="inline-block rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-wide"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  status: {
    type: String,
    required: true,
    /** @type {'free' | 'nearly_full' | 'full' | string} */
  },
});

const label = computed(() => {
  if (props.status === "free") return "Disponible";
  if (props.status === "nearly_full") return "Presque plein";
  if (props.status === "full") return "Complet";
  return props.status;
});

const badgeClass = computed(() => {
  if (props.status === "free") return "bg-emerald-100 text-emerald-900";
  if (props.status === "nearly_full") return "bg-amber-100 text-amber-900";
  if (props.status === "full") return "bg-neutral-200 text-neutral-600";
  return "bg-neutral-100 text-neutral-700";
});
</script>
