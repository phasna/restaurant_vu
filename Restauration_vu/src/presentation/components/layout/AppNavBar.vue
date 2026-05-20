<template>
  <Disclosure as="nav" class="relative border-b border-black/10 bg-white" v-slot="{ open }">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center sm:hidden">
        <DisclosureButton
          class="inline-flex size-10 shrink-0 items-center justify-center rounded-sm text-black hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
        >
          <span class="sr-only">Ouvrir le menu</span>
          <Bars3Icon v-if="!open" class="size-6" aria-hidden="true" />
          <XMarkIcon v-else class="size-6" aria-hidden="true" />
        </DisclosureButton>
        <button
          type="button"
          class="absolute left-1/2 -translate-x-1/2 font-serif text-lg tracking-[0.12em] text-black uppercase"
          @click="$emit('logo-click')"
        >
          {{ brand }}
        </button>
        <div class="size-10 shrink-0" aria-hidden="true"></div>
      </div>

      <div
        class="hidden h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center sm:grid"
      >
        <div class="flex justify-start">
          <button
            type="button"
            class="text-left font-serif text-xl tracking-[0.15em] text-black uppercase lg:text-2xl"
            @click="$emit('logo-click')"
          >
            {{ brand }}
          </button>
        </div>
        <nav class="flex items-center justify-center gap-8 font-sans lg:gap-12" aria-label="Principal">
          <button
            v-for="link in links"
            :key="link.to"
            type="button"
            :class="[
              'border-b border-transparent pb-1 text-sm font-medium text-black transition-colors hover:border-black/40',
              isActive(link) ? 'border-black' : '',
            ]"
            @click="$emit('navigate', link.to)"
          >
            {{ link.label }}
          </button>
        </nav>
        <div class="flex justify-end">
          <button
            type="button"
            class="bg-black px-6 py-3 font-sans text-xs font-semibold tracking-wide text-white uppercase focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            @click="$emit('cta-click')"
          >
            {{ ctaLabel }}
          </button>
        </div>
      </div>
    </div>

    <DisclosurePanel class="border-t border-black/10 bg-white sm:hidden">
      <div class="flex flex-col px-4 py-4">
        <DisclosureButton
          v-for="link in links"
          :key="link.to"
          as="button"
          type="button"
          :class="[
            'border-b py-3 text-left text-sm font-medium text-black',
            isActive(link) ? 'border-black' : 'border-black/10',
          ]"
          @click="$emit('navigate', link.to)"
        >
          {{ link.label }}
        </DisclosureButton>
        <DisclosureButton
          as="button"
          type="button"
          class="mt-4 w-full bg-black py-3 text-center font-sans text-xs font-semibold tracking-wide text-white uppercase"
          @click="$emit('cta-click')"
        >
          {{ ctaLabel }}
        </DisclosureButton>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<script setup>
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  /** Texte marque (logo). */
  brand: {
    type: String,
    default: "L'ESSENCE",
  },
  /** Liens centrés : `{ label, to }` (chemins logiques, sans fetch). */
  links: {
    type: Array,
    required: true,
  },
  /** Chemin actif pour le soulignement (ex. route.path). */
  activePath: {
    type: String,
    default: "",
  },
  /** Libellé du bouton droit (ex. Réserver / Connexion). */
  ctaLabel: {
    type: String,
    default: "Réserver",
  },
});

defineEmits(["logo-click", "navigate", "cta-click"]);

function isActive(link) {
  if (link.activePrefix) {
    return props.activePath.startsWith(link.activePrefix);
  }
  if (link.to === "/") {
    return props.activePath === "/";
  }
  return (
    props.activePath === link.to || props.activePath.startsWith(`${link.to}/`)
  );
}
</script>
