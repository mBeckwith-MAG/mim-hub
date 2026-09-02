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
        <div class="flex justify-end gap-lg items-center">
          <ColorKey
            groupName="inventory"
            :guides="[
              {
                color: 'bg-yellow-500',
                label: 'Working',
              },
              {
                color: 'bg-red-500',
                label: 'Reject',
              },
              {
                color: 'bg-purple-500',
                label: 'Missing Vendor',
              },
              {
                color: 'bg-emerald-500',
                label: 'Done',
              },
            ]"
          />
          <RouterLink to="/inventory/add-vehicle">
            <Icon
              icon="basil:add-outline"
              width="4em"
              class="btn secondary outlined"
            />
          </RouterLink>
        </div>
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
  CurrentBoardColumns,
  PreviousBoardColumns,
  PrintingBoardColumns,
} from '@mim-workspace/constants';
import type { Item } from '@mim-workspace/types';
import { InventoryItem } from '@mim-workspace/models';
import ItemCard from '../components/ItemCard.vue';
import { Icon } from '@iconify/vue';
import {
  ColorKey,
  Container,
  FilterBar,
  Loading,
  Navigation,
  TabContainer,
} from '@mim-workspace/ui';

const storeName: Ref<string | null> = ref(null);
const route = useRoute();
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
    storeName.value =
      Stores.find(
        (store) => store.abbr === String(route.params.storeAbbr).toUpperCase()
      )?.name || null;
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

    currentItems.value = currentBoardItems.filter(
      (item: InventoryItem) => item.store_name?.text === storeName.value
    );
    previousItems.value = previousBoardItems.filter(
      (item: InventoryItem) => item.store_name?.text === storeName.value
    );
    printItems.value = printingBoardItems.filter(
      (item: InventoryItem) => item.store_name?.text === storeName.value
    );

    const allItems = [
      ...currentItems.value,
      ...previousItems.value,
      ...printItems.value,
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
