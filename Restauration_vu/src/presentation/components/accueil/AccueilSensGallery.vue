<template>
  <section
    class="bg-neutral-950 text-white"
    :aria-labelledby="headingId"
  >
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <h2
        :id="headingId"
        class="max-w-3xl font-serif text-3xl leading-tight sm:text-4xl lg:text-[2.5rem]"
      >
        {{ title }}
      </h2>
      <p
        v-if="lead"
        class="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-white/70 sm:text-base"
      >
        {{ lead }}
      </p>
      <div class="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        <figure
          v-for="(src, index) in images"
          :key="index"
          class="relative aspect-square overflow-hidden bg-white/5 ring-1 ring-inset ring-white/10"
        >
          <img
            :src="src"
            :alt="`${ariaLabelBase} ${index + 1}`"
            class="h-full w-full object-cover transition duration-500 hover:scale-105"
            loading="lazy"
            decoding="async"
            width="800"
            height="800"
          />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  lead: { type: String, default: "" },
  headingId: { type: String, default: "accueil-sens-heading" },
  /** URLs des visuels (ordre = grille). */
  images: {
    type: Array,
    required: true,
  },
  ariaLabelBase: {
    type: String,
    default: "Visuel galerie",
  },
});
</script>
