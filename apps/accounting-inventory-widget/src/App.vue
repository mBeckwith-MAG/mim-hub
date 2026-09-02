<template>
  <Container>
    <p class="text-2xl font-thin font-stretch-semi-expanded">
      My Assigned Items
    </p>
    <p v-if="loading">Loading...</p>
    <p v-if="error">{{ error }}</p>

    <ItemDisplay v-else v-for="item in assignedItems" :item :key="item.id" />
  </Container>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCurrentItemsStore } from '@/stores/current_items';

import { Container } from '@mim-workspace/ui';
import ItemDisplay from '@/components/ItemDisplay.vue';

const currentItemsStore = useCurrentItemsStore();
const { assignedItems, loading, error } = storeToRefs(currentItemsStore);
</script>
