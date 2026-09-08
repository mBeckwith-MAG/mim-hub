<template>
  <div :class="[row ? 'flex' : 'grid', 'gap-sm w-full h-full mt-xl']">
    <label v-if="showLabel" :for="`${name}-reversal-checkbox-${uid}`">{{
      label
    }}</label>
    <input
      type="checkbox"
      :id="`${name}-reversal-checkbox-${uid}`"
      class="ms-auto me-auto checked:bg-red-500"
      :disabled
      v-model="model"
    />
    <small v-if="showDescription"
      >Check if this should be considered a Reversal</small
    >
  </div>
</template>
<script setup lang="ts">
const model = defineModel();
withDefaults(
  defineProps<{
    name: string;
    uid: number;
    label?: string;
    showDescription?: boolean;
    showLabel?: boolean;
    disabled?: boolean;
    row?: boolean;
  }>(),
  {
    uid: 0,
    label: 'Reversal',
    showDescription: false,
    showLabel: false,
    disabled: false,
    row: false,
  }
);
</script>
