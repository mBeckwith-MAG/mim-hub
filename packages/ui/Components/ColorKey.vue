<template>
  <div class="flex justify-evenly gap-md border border-border rounded-2xl p-lg">
    <div
      class="flex gap-sm items-center"
      v-for="(guide, index) in guides"
      :key="`${groupName}-key-${index}`"
    >
      <span :class="['rounded-full h-sm w-sm self-center', guide.color]" />
      <span>{{ guide.label }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ColorKeyGuide } from '../../types';

defineProps<{
  groupName: string;
  guides: Array<ColorKeyGuide>;
}>();
</script>
