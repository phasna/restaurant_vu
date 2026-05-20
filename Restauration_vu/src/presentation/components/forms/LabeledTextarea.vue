<template>
  <div>
    <label
      :for="inputId"
      class="mb-1 block font-sans text-xs font-semibold uppercase tracking-wider text-black/60"
    >
      {{ label }}
    </label>
    <textarea
      :id="inputId"
      :rows="rows"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full border border-black/15 bg-white px-3 py-2.5 font-sans text-sm text-black placeholder:text-black/30 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="mt-1 font-sans text-xs text-red-700">{{ error }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  inputId: { type: String, required: true },
  modelValue: { type: String, default: "" },
  rows: { type: Number, default: 4 },
  placeholder: { type: String, default: "" },
  error: { type: String, default: "" },
});

defineEmits(["update:modelValue"]);
</script>
