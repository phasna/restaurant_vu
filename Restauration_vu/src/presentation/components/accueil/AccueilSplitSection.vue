<template>
  <section
    class="border-b border-black/10 bg-white"
    :aria-labelledby="headingId"
  >
    <div
      class="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24"
    >
      <figure
        class="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 ring-1 ring-inset ring-black/10 lg:aspect-auto lg:min-h-[22rem]"
        :class="reverse ? 'lg:order-2' : ''"
      >
        <img
          v-if="imageSrc"
          :src="imageSrc"
          :alt="imageAriaLabel"
          class="h-full min-h-[16rem] w-full object-cover lg:min-h-[22rem]"
          loading="lazy"
          decoding="async"
          width="1400"
          height="933"
        />
        <div
          v-else
          class="absolute inset-0 bg-neutral-100"
          role="img"
          :aria-label="imageAriaLabel"
        />
      </figure>
      <div :class="reverse ? 'lg:order-1' : ''">
        <p
          v-if="eyebrow"
          class="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-black/50"
        >
          {{ eyebrow }}
        </p>
        <h2
          :id="headingId"
          class="mt-3 font-serif text-3xl leading-tight text-black sm:text-4xl lg:text-[2.5rem]"
        >
          {{ title }}
        </h2>
        <p class="mt-6 font-sans text-base leading-relaxed text-black/70">
          {{ body }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  eyebrow: { type: String, default: "" },
  title: { type: String, required: true },
  body: { type: String, required: true },
  /** Si true : visuel à droite sur desktop (alternance maquette). */
  reverse: { type: Boolean, default: false },
  headingId: { type: String, required: true },
  imageAriaLabel: {
    type: String,
    default: "Illustration (placeholder)",
  },
  imageSrc: { type: String, default: "" },
});
</script>
