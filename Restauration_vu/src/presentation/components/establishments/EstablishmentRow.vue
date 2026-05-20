<template>
  <article
    class="grid gap-8 border-b border-black/10 py-12 last:border-b-0 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center"
  >
    <div class="aspect-video w-full overflow-hidden bg-neutral-100 ring-1 ring-inset ring-black/5">
      <img
        :src="restaurant.imageUrl"
        :alt="restaurant.name"
        class="h-full w-full object-cover"
        loading="lazy"
        width="960"
        height="540"
      />
    </div>
    <div>
      <h2 class="font-serif text-2xl text-black sm:text-3xl">
        {{ restaurant.name }}
      </h2>
      <p class="mt-1 text-xs font-semibold uppercase tracking-wider text-black/40">
        {{ restaurant.cuisineType }}
      </p>
      <p class="mt-4 text-sm leading-relaxed text-black/70">
        {{ restaurant.description }}
      </p>
      <p class="mt-2 text-sm text-black/60">{{ restaurant.address }}</p>
      <div class="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          class="border border-black px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-black hover:bg-black/5"
          @click="$emit('discover', restaurant.id)"
        >
          Découvrir
        </button>
        <button
          type="button"
          class="bg-black px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wider text-white"
          @click="$emit('reserve', restaurant.id)"
        >
          Réserver
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  restaurant: { type: Object, required: true },
});

defineEmits(["discover", "reserve"]);
</script>
