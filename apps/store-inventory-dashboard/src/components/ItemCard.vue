<template>
  <Card separated :class="statusBorder">
    <template #title>
      <div class="grid gap-1">
        <div class="text-2xl">{{ item.stock_number }}</div>
        <small><DateDisplay :date="item.created_date.text || ''" /></small>
      </div>

      <div class="grid gap-1">
        <Badge :class="carTypeVariant">{{ item.car_type.text }}</Badge>
        <Badge :class="priorityVariant">{{ item.priority.text }}</Badge>
      </div>
    </template>

    <template #body>
      <div class="min-h-60">
        <div class="grid grid-cols-3 gap-4">
          <DataDisplay
            v-for="(data, index) in itemData"
            :key="`${item.uid}-data-${index}`"
            :k="data.key"
            :value="data.value"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { InventoryItem } from '@mim-workspace/models';
import { Badge, Card, DateDisplay } from '@mim-workspace/ui';
import DataDisplay from '@mim-workspace/ui/Components/DataDisplay.vue';
const props = defineProps<{
  item: InventoryItem;
}>();

const carTypeVariant = computed(() => {
  if (props.item.car_type.text?.includes('New')) return 'primary';
  return 'warning';
});

const priorityVariant = computed(() => {
  return 'secondary';
});

const itemData = computed(() => {
  return Object.entries(props.item)
    .filter((entry) => {
      const value = entry[1];
      return value.text && value.text !== null && value.text !== '';
    })
    .map((entry) => {
      return {
        key: entry[0],
        value: entry[1].text,
      };
    });
});

const statusBorder = computed(() => {
  const status = props.item.status.text;
  const base_style = 'border-l-20';

  if (status?.includes('Working')) return `${base_style} border-l-yellow-500`;
  if (status?.includes('Reject')) return `${base_style} border-l-red-500`;
  if (status?.includes('Missing')) return `${base_style} border-l-purple-500`;
  if (status?.includes('Done')) return `${base_style} border-l-emerald-500`;
  return `${base_style} border-l-gray-500`;
});
</script>
