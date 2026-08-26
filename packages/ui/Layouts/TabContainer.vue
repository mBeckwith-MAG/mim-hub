<template>
  <div>
    <Container class="fixed top-6 left-1/3 flex gap-2x text-2xl font-thin z-60">
      <button
        v-for="tab in processedTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-sm cursor-pointer transition-color',
          { 'text-sky-500 border-b-2 border-sky-500': activeTab === tab.id },
        ]"
      >
        <Icon :icon="tab.icon" />
        <span>{{ tab.name }}</span>
      </button>
    </Container>

    <Container>
      <div v-for="tab in processedTabs" :key="tab.id">
        <div v-if="activeTab === tab.id">
          <div v-if="tab.items && tab.items.length">
            <Grid :cols="3">
              <template
                v-for="(item, index) in tab.items"
                :key="`${item.uid}-item-${index}`"
              >
                <slot :name="tab.id" :item="item" :index="index">
                  {{ item }}
                </slot>
              </template>
            </Grid>
          </div>
          <div v-else>No Items</div>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { Container, Grid } from '.';
import { InventoryItem } from '../../models';
import { Item } from '../../types';
import { Icon } from '@iconify/vue';

type Tab = {
  id: string;
  name: string;
  icon: string;
  items: Array<InventoryItem>;
  search?: string;
};

const activeTab = ref<string>('');
const props = defineProps<{ tabs: Tab[] }>();

onMounted(() => {
  if (props.tabs.length > 0) activeTab.value = props.tabs[0].id;
});

const processedTabs = computed(() => {
  return props.tabs.map((tab) => {
    const query = tab.search?.toLowerCase().trim() || '';

    if (!query) return tab;

    const filtered = tab.items.filter((item: InventoryItem) => {
      return Object.values(item).some((val) => {
        if (!val) return false;
        if (typeof val === 'string') {
          return val.toLowerCase().includes(query);
        }
        if (
          typeof val === 'object' &&
          'text' in val &&
          typeof val.text === 'string'
        ) {
          return val.text.toLowerCase().includes(query);
        }
        return false;
      });
    });

    const sorted = filtered.sort((a: InventoryItem, b: InventoryItem) => {
      if (a.created_date?.text && b.created_date?.text) {
        return a.created_date.text.localeCompare(b.created_date.text);
      }
      return 0;
    });

    return {
      ...tab,
      items: sorted,
    };
  });
});
</script>
