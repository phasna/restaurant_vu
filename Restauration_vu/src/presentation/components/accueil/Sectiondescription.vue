<template>
  <div class="grid gap-10 lg:grid-cols-3 lg:items-center lg:gap-16 m-20">
    <div
      class="aspect-4/4 w-full bg-neutral-100 ring-1 ring-inset ring-black/10"
      role="img"
      :aria-label="imageAriaLabel"
    />
    <div class="max-w-xl">
      <p class="text-sm font-light text-black">PHILOSOPHIE</p>

      <h1
        :id="headingId"
        class="font-serif text-4xl leading-[1.1] text-black sm:text-5xl lg:text-6xl"
      >
        {{ title }}
      </h1>
      <p class="mt-6 text-base leading-relaxed text-black/70">
        {{ lead }}
      </p>
    </div>
  </div>
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
});

defineEmits(["primary-click", "secondary-click"]);
</script>
