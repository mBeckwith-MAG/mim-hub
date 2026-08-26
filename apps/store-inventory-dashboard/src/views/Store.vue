<template>
  <div v-if="loading" class="flex justify-center">
    <Loading hasLabel />
  </div>
  <Container v-else-if="error">
    <div class="title">{{ error }}</div>
  </Container>
  <div v-else>
    <Navigation class="py-0.75 px-4">
      <template #left>{{ storeName }} Inventory</template>
      <template #right>
        <RouterLink to="/inventory/add-vehicle">
          <Icon
            icon="basil:add-outline"
            width="4em"
            class="btn secondary outlined"
          />
        </RouterLink>
      </template>
    </Navigation>
    <FilterBar
      :class="['fixed z-40']"
      v-model="searchQuery"
      :dropdowns="searchOptions"
      horizontal
    />
    <Container class="relative top-10">
      <div v-if="filteredItems && filteredItems.length">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-x-4">
          <ItemCard
            v-for="item in filteredItems"
            :item
            :key="item.uid"
            class="mb-8"
          />
        </div>
      </div>
      <div v-else class="title">No Items</div>
    </Container>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  BASE_URL,
  BOARDS,
  Stores,
  carTypeOptions,
  newOriginOptions,
  statusOptions,
  titleOrPayoffOptions,
  usedOriginOptions,
} from '@mim-workspace/constants';
import type { Item } from '@mim-workspace/types';
import { InventoryItem } from '@mim-workspace/models';
import ItemCard from '../components/ItemCard.vue';
import { Icon } from '@iconify/vue';
import { Container, FilterBar, Loading, Navigation } from '@mim-workspace/ui';

const storeName: Ref<string | null> = ref(null);
const route = useRoute();
const loading = ref(true);
const error = ref('');
const allItems: Ref<InventoryItem[]> = ref([]);
const searchQuery = ref('');
const searchOptions = ref([
  {
    name: 'carType',
    label: 'Car Type',
    options: carTypeOptions,
  },
  {
    name: 'status',
    label: 'Status',
    options: statusOptions,
  },
  {
    name: 'carOrigin',
    label: 'Car Origin',
    options: [...newOriginOptions, ...usedOriginOptions],
  },
  {
    name: 'titleOrPayoff',
    label: 'Title or Payoff',
    options: titleOrPayoffOptions,
  },
]);

onMounted(async () => {
  try {
    storeName.value =
      Stores.find(
        (store) => store.abbr === String(route.params.storeAbbr).toUpperCase()
      )?.name || null;
    const response = await fetch(`${BASE_URL}/boards/${BOARDS.currentItems}`);

    if (!response.ok) {
      throw new Error(`Inventory request failed (${response.status})`);
    }

    const { items } = await response.json();
    const sortedItems = items
      .map((item: Item) => new InventoryItem(item))
      .filter((item: InventoryItem) => item.store_name.text === storeName.value)
      .sort((a: InventoryItem, b: InventoryItem) => {
        if (a.created_date?.text && b.created_date?.text) {
          return a.created_date.text.localeCompare(b.created_date.text);
        }
        return 0;
      });

    searchOptions.value.push({
      name: 'submitBy',
      label: 'Submit By',
      options: [
        ...new Set(
          sortedItems
            .map((item: InventoryItem) => item?.submit_by?.text)
            .filter((name: string) => !!name)
        ),
      ] as string[],
    });

    allItems.value = sortedItems;
  } catch (requestError) {
    error.value =
      requestError instanceof Error
        ? requestError.message
        : 'Unable to load inventory';
  } finally {
    loading.value = false;
  }
});

const filteredItems = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();

  if (!query) return allItems.value;

  return allItems.value.filter((item: InventoryItem) => {
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
});
</script>
