<template>
  <section
    class="border-b border-black/10 bg-white"
    :aria-labelledby="headingId"
  >
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div class="mx-auto max-w-xl text-center">
        <h2
          :id="headingId"
          class="font-serif text-3xl text-black sm:text-4xl"
        >
          {{ title }}
        </h2>
        <p
          v-if="description"
          class="mt-4 font-sans text-base leading-relaxed text-black/70"
        >
          {{ description }}
        </p>
        <form
          class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center"
          @submit.prevent="$emit('subscribe', modelValue)"
        >
          <label class="sr-only" :for="inputId">{{ inputPlaceholder }}</label>
          <input
            :id="inputId"
            type="email"
            autocomplete="email"
            required
            :placeholder="inputPlaceholder"
            class="min-h-12 flex-1 border border-black/20 bg-white px-4 font-sans text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:max-w-xs"
            :value="modelValue"
            @input="$emit('update:modelValue', $event.target.value)"
          />
          <button
            type="submit"
            class="min-h-12 bg-black px-8 font-sans text-xs font-semibold uppercase tracking-wider text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            {{ buttonLabel }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  buttonLabel: { type: String, default: "S'abonner" },
  inputPlaceholder: { type: String, default: "Votre adresse e-mail" },
  modelValue: { type: String, default: "" },
  headingId: { type: String, default: "accueil-newsletter-heading" },
  inputId: { type: String, default: "accueil-newsletter-email" },
});

defineEmits(["update:modelValue", "subscribe"]);
</script>
