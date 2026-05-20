<template>
  <section
    class="border-b border-black/10 bg-white"
    :aria-labelledby="sectionHeadingId"
  >
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <h2
        :id="sectionHeadingId"
        class="font-serif text-3xl text-black sm:text-4xl"
      >
        {{ sectionTitle }}
      </h2>
      <p class="mt-4 max-w-2xl font-sans text-base leading-relaxed text-black/70">
        {{ sectionLead }}
      </p>
      <div class="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <DestinationCard
          v-for="item in destinations"
          :key="item.id"
          :title="item.title"
          :subtitle="item.subtitle"
          :title-id="`${sectionHeadingId}-${item.id}`"
          :image-aria-label="item.imageAriaLabel"
          :image-src="item.imageSrc"
          @discover="$emit('discover', item.id)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import DestinationCard from "@/presentation/components/accueil/DestinationCard.vue";

defineProps({
  sectionTitle: { type: String, required: true },
  sectionLead: { type: String, required: true },
  sectionHeadingId: { type: String, default: "accueil-destinations" },
  destinations: {
    type: Array,
    required: true,
    /** `{ id, title, subtitle, imageAriaLabel?, imageSrc? }` */
  },
});

defineEmits(["discover"]);
</script>
