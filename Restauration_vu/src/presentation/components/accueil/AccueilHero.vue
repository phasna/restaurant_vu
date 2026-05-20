<template>
  <section
    class="border-b border-black/10 bg-white"
    :aria-labelledby="headingId"
  >
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div class="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div class="max-w-xl">
          <h1
            :id="headingId"
            class="font-serif text-4xl leading-[1.1] text-black sm:text-5xl lg:text-6xl"
          >
            {{ title }}
          </h1>
          <p class="mt-6 font-sans text-base leading-relaxed text-black/70">
            {{ lead }}
          </p>
          <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              class="inline-flex items-center justify-center bg-black px-8 py-3 text-center font-sans text-xs font-semibold uppercase tracking-wider text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              @click="$emit('primary-click')"
            >
              {{ primaryCtaLabel }}
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center border border-black bg-transparent px-8 py-3 text-center font-sans text-xs font-semibold uppercase tracking-wider text-black hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              @click="$emit('secondary-click')"
            >
              {{ secondaryCtaLabel }}
            </button>
          </div>
        </div>
        <figure
          class="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 ring-1 ring-inset ring-black/10"
        >
          <img
            v-if="imageSrc"
            :src="imageSrc"
            :alt="imageAriaLabel"
            class="h-full w-full object-cover"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            width="1600"
            height="1200"
          />
          <div
            v-else
            class="absolute inset-0 bg-neutral-100"
            role="presentation"
          />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  lead: { type: String, required: true },
  primaryCtaLabel: { type: String, required: true },
  secondaryCtaLabel: { type: String, required: true },
  headingId: { type: String, default: "accueil-hero-heading" },
  imageAriaLabel: {
    type: String,
    default: "Visuel du restaurant (placeholder)",
  },
  /** URL absolue ou chemin `/…` vers l’image ; si vide, fond neutre. */
  imageSrc: { type: String, default: "" },
});

defineEmits(["primary-click", "secondary-click"]);
</script>
