<template>
  <aside
    class="border border-black/10 bg-white p-6 font-sans shadow-sm"
    aria-label="Récapitulatif de réservation"
  >
    <div
      v-if="imageUrl"
      class="mb-4 aspect-video w-full overflow-hidden bg-neutral-100"
    >
      <img
        :src="imageUrl"
        :alt="title"
        class="h-full w-full object-cover"
        loading="lazy"
        width="400"
        height="225"
      />
    </div>
    <h2 class="text-xs font-semibold uppercase tracking-widest text-black/50">
      Récapitulatif
    </h2>
    <p class="mt-2 font-serif text-lg text-black">{{ title }}</p>
    <p class="mt-1 text-sm leading-relaxed text-black/70">{{ address }}</p>
    <dl class="mt-4 space-y-2 text-sm">
      <div class="flex justify-between gap-4 border-b border-black/5 pb-2">
        <dt class="text-black/50">Date</dt>
        <dd class="font-medium text-black">{{ dateLabel }}</dd>
      </div>
      <div class="flex justify-between gap-4 border-b border-black/5 pb-2">
        <dt class="text-black/50">Heure</dt>
        <dd class="font-medium text-black">{{ timeLabel }}</dd>
      </div>
      <div v-if="covers != null" class="flex justify-between gap-4 pb-2">
        <dt class="text-black/50">Personnes</dt>
        <dd class="font-medium text-black">{{ covers }}</dd>
      </div>
    </dl>
    <button
      v-if="showModify"
      type="button"
      class="mt-6 w-full border border-black py-2 text-xs font-semibold uppercase tracking-wider text-black hover:bg-black/5"
      @click="$emit('modify')"
    >
      Modifier
    </button>
  </aside>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  address: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
  dateLabel: { type: String, required: true },
  timeLabel: { type: String, required: true },
  covers: { type: [Number, String], default: null },
  showModify: { type: Boolean, default: true },
});

defineEmits(["modify"]);
</script>
