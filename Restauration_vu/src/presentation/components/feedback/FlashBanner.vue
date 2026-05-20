<template>
  <div
    v-if="success || error"
    class="border-b border-black/10 px-4 py-3 text-center font-sans text-sm"
    :class="error ? 'bg-red-50 text-red-800' : 'bg-neutral-50 text-black'"
    role="status"
  >
    <span>{{ success || error }}</span>
    <button
      type="button"
      class="ml-3 underline decoration-black/30 underline-offset-2 hover:text-black/80"
      @click="$emit('dismiss')"
    >
      Fermer
    </button>
  </div>
</template>

<script setup>
defineProps({
  success: { type: String, default: "" },
  error: { type: String, default: "" },
});

defineEmits(["dismiss"]);
</script>
