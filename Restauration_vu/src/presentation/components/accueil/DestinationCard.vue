<template>
  <article
    class="flex flex-col border border-black/10 bg-white"
    :aria-labelledby="titleId"
  >
    <figure class="relative aspect-4/3 w-full overflow-hidden bg-neutral-100 ring-1 ring-inset ring-black/5">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="imageAriaLabel"
        class="h-full w-full object-cover"
        loading="lazy"
        decoding="async"
        width="900"
        height="600"
      />
      <div
        v-else
        class="absolute inset-0 bg-neutral-100"
        role="img"
        :aria-label="imageAriaLabel"
      />
    </figure>
    <div class="flex flex-1 flex-col p-6">
      <h3 :id="titleId" class="font-serif text-xl text-black">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="mt-1 font-sans text-sm text-black/60">
        {{ subtitle }}
      </p>
      <div class="mt-6">
        <button
          type="button"
          class="font-sans text-xs font-semibold uppercase tracking-wider text-black underline decoration-black underline-offset-4 transition hover:text-black/70"
          @click="$emit('discover')"
        >
          Découvrir
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  titleId: { type: String, required: true },
  imageAriaLabel: {
    type: String,
    default: "Visuel établissement (placeholder)",
  },
  imageSrc: { type: String, default: "" },
});

defineEmits(["discover"]);
</script>
