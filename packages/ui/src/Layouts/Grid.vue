<template>
  <div
    :class="['grid gap-md', { 'md:grid-cols-2': cols > 1 }, { 'p-sm': padded }]"
    :style="{
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    cols?: number;
    rows?: number;
    padded?: boolean;
  }>(),
  {
    cols: 1,
    rows: 1,
    padded: false,
  }
);
</script>
