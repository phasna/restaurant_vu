<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
    <button
      v-for="slot in slots"
      :key="slot.id"
      type="button"
      :disabled="slot.status === 'full'"
      class="flex flex-col border px-3 py-3 text-left font-sans transition focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      :class="buttonClass(slot)"
      @click="onPick(slot)"
    >
      <span class="text-sm font-semibold text-black">
        {{ slot.startTime }} – {{ slot.endTime }}
      </span>
      <span class="mt-2">
        <SlotStatusBadge :status="slot.status" />
      </span>
      <span class="mt-1 text-xs text-black/50">
        {{ slot.bookedCovers }}/{{ slot.totalCapacity }} couverts
      </span>
    </button>
  </div>
</template>

<script setup>
import SlotStatusBadge from "@/presentation/components/booking/SlotStatusBadge.vue";

const props = defineProps({
  slots: { type: Array, required: true },
  modelValue: { type: String, default: "" },
});

const emit = defineEmits(["update:modelValue"]);

function buttonClass(slot) {
  if (slot.status === "full") {
    return "cursor-not-allowed border-black/10 bg-neutral-50 opacity-60";
  }
  if (props.modelValue === slot.id) {
    return "border-black bg-neutral-50 ring-2 ring-black";
  }
  return "border-black/15 bg-white hover:border-black/40";
}

function onPick(slot) {
  if (slot.status === "full") return;
  emit("update:modelValue", slot.id);
}
</script>
