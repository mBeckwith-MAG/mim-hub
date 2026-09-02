<template>
  <Card separated :class="statusBorder">
    <template #title>
      <div class="flex flex-col justify-start gap-1 font-thin items-start">
        <div class="text-2xl">{{ item.stock_number }}</div>
        <DateDisplay class="text-sm" :date="item.created_date?.text || ''" />
        <small>{{ item.submit_by?.text }}</small>
      </div>

      <p class="text-2xl font-thin">{{ item.store_name?.text }}</p>

      <div class="grid gap-1">
        <Badge :class="carTypeVariant">{{ item.car_type?.text }}</Badge>
        <Badge :class="priorityVariant">{{ item.priority?.text }}</Badge>
      </div>
    </template>

    <template #body>
      <div class="min-h-60">
        <Grid :cols="3" class="mb-sm gap-xl">
          <DataDisplay
            label="origin"
            :value="item.new_origin?.text || item.used_origin?.text || ''"
          />
          <DateDisplay :date="item.start_date?.text || ''"
            >START DATE</DateDisplay
          >
          <DateDisplay :date="item.end_date?.text || ''">END DATE</DateDisplay>
        </Grid>
        <Grid
          :cols="4"
          v-if="
            item.payoff_amount?.text ||
            item.good_till_date?.text ||
            item.lien_holder?.text ||
            item.per_diam?.text
          "
        >
          <DataDisplay
            label="payoff amount"
            :value="item.payoff_amount?.text || '0'"
          />
          <DateDisplay :date="item.good_till_date?.text || ''"
            >GOOD TILL</DateDisplay
          >

          <DataDisplay
            label="lien holder"
            :value="removeYear(item.lien_holder?.text || '-')"
          />
          <DataDisplay label="per diam" :value="item.per_diam?.text || '0'" />
        </Grid>
      </div>
    </template>
    <template #footer>
      <Grid :cols="2" class="w-full">
        <FormTextarea name="additional" v-model="formNotes"
          >Form Notes</FormTextarea
        >
        <FormTextarea name="inventory" v-model="inventoryNotes"
          >Inventory Notes</FormTextarea
        >
        <RouterLink
          v-if="item.status?.text?.toLowerCase().includes('reject')"
          :to="`/inventory/edit-vehicle/${item.uid}`"
          custom
          v-slot="{ navigate }"
        >
          <Button
            variant="secondary"
            outlined
            @click="navigate"
            class="col-span-2"
            >FIX</Button
          >
        </RouterLink>
      </Grid>
    </template>
  </Card>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { InventoryItem } from '@mim-workspace/models';
import {
  Badge,
  Button,
  Card,
  DataDisplay,
  DateDisplay,
  FormTextarea,
  Grid,
} from '@mim-workspace/ui';

const props = defineProps<{
  item: InventoryItem;
}>();

const formNotes = computed(() => {
  return props.item.form_notes?.text || 'No Notes';
});

const inventoryNotes = computed(() => {
  return props.item.inventory_notes?.text || 'No Notes';
});

const carTypeVariant = computed(() => {
  if (props.item.car_type?.text?.includes('New')) return 'primary';
  return 'warning';
});

const priorityVariant = computed(() => {
  return 'secondary';
});

const statusBorder = computed(() => {
  const status = props.item.status?.text;
  const base_style = 'border-l-20';

  if (status?.includes('Working')) return `${base_style} border-l-yellow-500`;
  if (status?.includes('Reject')) return `${base_style} border-l-red-500`;
  if (status?.includes('Missing')) return `${base_style} border-l-purple-500`;
  if (status?.includes('Done')) return `${base_style} border-l-emerald-500`;
  return `${base_style} border-l-gray-500`;
});

function removeYear(dateString: string) {
  const arr = dateString.split('-');
  return [arr[1], arr[2]].join('-');
}
</script>
