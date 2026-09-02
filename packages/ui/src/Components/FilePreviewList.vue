<template>
  <div
    class="max-h-100 overflow-y-scroll [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
  >
    <Grid :cols="cols">
      <div
        v-for="item in items"
        :key="item.id"
        class="relative flex flex-col items-center p-3 border border-light rounded-lg bg-mid shadow-sm"
      >
        <img
          v-if="item.preview"
          :src="item.preview"
          class="w-16 h-16 object-cover rounded mb-2 shadow-inner"
        />
        <div
          v-else
          class="w-16 h-16 flex items-center justify-center bg-light rounded text-2xl mb-2"
        >
          📄
        </div>
        <p
          class="w-full text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate px-1"
        >
          {{ item.file.name }}
        </p>
        <p class="text-[10px] text-gray-400 dark:text-gray-500">
          {{ (item.file.size / 1024).toFixed(1) }} KB
        </p>
        <button
          type="button"
          @click.stop.prevent="$emit('remove', item.id)"
          class="absolute top-0 right-0 bg-mid hover:bg-red-300 text-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors cursor-pointer"
          aria-label="Remove item"
        >
          ✕
        </button>
      </div>
    </Grid>
  </div>
</template>

<script setup lang="ts">
import { RawFile } from '../../../types';
import { Grid } from '../Layouts';

withDefaults(
  defineProps<{
    items: RawFile[];
    cols?: number;
  }>(),
  {
    cols: 5,
  }
);

defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>
