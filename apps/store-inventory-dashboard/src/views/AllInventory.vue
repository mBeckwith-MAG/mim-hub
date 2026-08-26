<template>
  <div v-if="loading" class="flex justify-center">
    <Loading hasLabel />
  </div>
  <Container v-else-if="error">
    <div class="title">{{ error }}</div>
  </Container>
  <div v-else>
    <Navigation class="py-0.75 px-4">
      <template #left>All Inventory</template>
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
      <TabContainer :tabs="tabs">
        <template #current="{ item }">
          <ItemCard :item />
        </template>
        <template #previous="{ item }">
          <ItemCard :item />
        </template>
        <template #print="{ item }">
          <ItemCard :item />
        </template>
      </TabContainer>
    </Container>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import {
  BASE_URL,
  BOARDS,
  carTypeOptions,
  newOriginOptions,
  statusOptions,
  titleOrPayoffOptions,
  usedOriginOptions,
  CurrentBoardColumns,
  PreviousBoardColumns,
  PrintingBoardColumns,
} from '@mim-workspace/constants';
import type { Item } from '@mim-workspace/types';
import { InventoryItem } from '@mim-workspace/models';
import ItemCard from '../components/ItemCard.vue';
import { Icon } from '@iconify/vue';
import {
  Container,
  FilterBar,
  Loading,
  Navigation,
  TabContainer,
} from '@mim-workspace/ui';

const loading = ref(true);
const error = ref('');
const currentItems: Ref<InventoryItem[]> = ref([]);
const previousItems: Ref<InventoryItem[]> = ref([]);
const printItems: Ref<InventoryItem[]> = ref([]);
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

const tabs = computed(() => [
  {
    id: 'current',
    name: 'Current Items',
    icon: 'fluent:vehicle-car-profile-ltr-16-regular',
    items: currentItems.value,
    search: searchQuery.value,
  },
  {
    id: 'previous',
    name: 'Previous Items',
    icon: 'fluent:vehicle-car-profile-ltr-clock-16-regular',
    items: previousItems.value,
    search: searchQuery.value,
  },
  {
    id: 'print',
    name: 'Printing Items',
    icon: 'famicons:print-outline',
    items: printItems.value,
    search: searchQuery.value,
  },
]);

onMounted(async () => {
  try {
    const currentResponse = await fetch(
      `${BASE_URL}/boards/${BOARDS.currentItems}`
    );
    const currentData = await currentResponse.json();
    const currentBoardItems = currentData.items.map((item: Item) => {
      return new InventoryItem(item, CurrentBoardColumns);
    });

    const previousResponse = await fetch(
      `${BASE_URL}/boards/${BOARDS.previousItems}`
    );
    const previousData = await previousResponse.json();
    const previousBoardItems = previousData.items.map((item: Item) => {
      return new InventoryItem(item, PreviousBoardColumns);
    });

    const printingResponse = await fetch(
      `${BASE_URL}/boards/${BOARDS.printingItems}`
    );
    const printingData = await printingResponse.json();
    const printingBoardItems = printingData.items.map((item: Item) => {
      return new InventoryItem(item, PrintingBoardColumns);
    });

    const allItems = [
      ...currentBoardItems,
      ...previousBoardItems,
      ...printingBoardItems,
    ];

    searchOptions.value.push({
      name: 'submitBy',
      label: 'Submit By',
      options: [
        ...new Set(
          allItems
            .map((item: InventoryItem) => item?.submit_by?.text)
            .filter((name: string | null | undefined): name is string => !!name)
        ),
      ],
    });

    currentItems.value = currentBoardItems;
    previousItems.value = previousBoardItems;
    printItems.value = printingBoardItems;
  } catch (requestError) {
    error.value =
      requestError instanceof Error
        ? requestError.message
        : 'Unable to load inventory';
  } finally {
    loading.value = false;
  }
});
</script>
