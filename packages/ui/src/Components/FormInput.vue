<template>
  <div class="relative mt-6">
    <input
      :type="inputType"
      :id="`form-input-${name}`"
      v-model="model"
      :disabled
      :class="[
        'peer h-10 w-full text-txt placeholder-transparent focus:outline-none focus:border-sky-500',
        [forceLabel ? 'ps-17' : 'ps-sm'],
        { 'border-b border-brdr': hasBorder },
      ]"
    />
    <label
      :for="`form-input-${name}`"
      :class="[
        'absolute left-md top-4 text-txt text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-txt peer-placeholder-shown:top-0 peer-focus:text-sky-500 peer-focus:text-sm pointer-events-none',
        { 'peer-focus:top-4': forceLabel },
        { 'peer-focus:-top-4 peer-valid:-top-4': hasBorder },
      ]"
    >
      <slot />
    </label>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string | number>();

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    default: 'text',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  forceLabel: {
    type: Boolean,
    default: false,
  },
  hasBorder: {
    type: Boolean,
    default: false,
  },
});
</script>
