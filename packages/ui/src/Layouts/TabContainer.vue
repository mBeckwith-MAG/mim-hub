<template>
  <div>
    <Container class="fixed top-6 left-1/3 flex gap-2x text-2xl font-thin z-60">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-sm cursor-pointer transition-colors pb-1',
          activeTab === tab.id
            ? 'text-sky-500 border-b-2 border-sky-500'
            : 'text-txt/60 hover:text-txt',
        ]"
      >
        <Icon :icon="tab.icon" />
        <span>{{ tab.name }}</span>
      </button>
    </Container>

    <Container class="relative top-10">
      <div v-if="activeTabItem">
        <div v-if="activeTabItem.items.length > 0">
          <Grid :cols="3">
            <template
              v-for="(item, index) in activeTabItem.items"
              :key="`${item.uid}-item-${index}`"
            >
              <slot :name="activeTabItem.id" :item="item" :index="index">
                {{ item }}
              </slot>
            </template>
          </Grid>
        </div>
        <div v-else class="text-center p-md text-txt/40 font-light text-lg">
          No Items Match Your Filters
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { Container, Grid } from '.';
import { InventoryItem } from '../../../models';
import { Icon } from '@iconify/vue';

type Tab = {
  id: string;
  name: string;
  icon: string;
  items: Array<InventoryItem>;
  search?: string;
  filters?: Record<string, any>;
};

const props = defineProps<{ tabs: Tab[] }>();
const activeTab = ref<string>('');

watchEffect(() => {
  if (props.tabs.length > 0 && !activeTab.value) {
    activeTab.value = props.tabs[0].id;
  }
});

const activeTabItem = computed(() => {
  const currentTab = props.tabs.find((t) => t.id === activeTab.value);
  if (!currentTab) return null;

  const textQuery = currentTab.search?.toLowerCase().trim() || '';
  const filterObject = currentTab.filters || {};

  const filtered = currentTab.items.filter((item: any) => {
    for (const [key, filterValue] of Object.entries(filterObject)) {
      if (!filterValue) continue;

      const targetValue =
        item[key]?.text !== undefined ? item[key]?.text : item[key];

      if (String(targetValue) !== String(filterValue)) {
        return false;
      }
    }

    if (!textQuery) return true;

    return Object.values(item).some((val: any) => {
      if (!val) return false;
      if (typeof val === 'string') return val.toLowerCase().includes(textQuery);
      if (typeof val === 'object' && 'text' in val)
        return String(val.text).toLowerCase().includes(textQuery);
      return false;
    });
  });

  const sorted = [...filtered].sort((a: any, b: any) => {
    const dateA = a.created_date?.text || '';
    const dateB = b.created_date?.text || '';
    return dateA.localeCompare(dateB);
  });

  // console.log('Current Tab', currentTab);
  // console.log('Sorted Items', sorted);

  return {
    ...currentTab,
    items: sorted,
  };
});
</script>
