<template>
  <Container class="h-full border rounded-md border-border">
    <Button v-if="items.length" v-for="item in items" @click="$emit('selected-item', item)">
      {{ item.name }}
    </Button>
    <div v-else>
      <p>No Items Assigned to you</p>
      <Button v-if="unassignedItems.length" @click="claimItem">Claim Item</Button>
    </div>
  </Container>
</template>
<script setup lang="ts">
import type { Item } from '@/utilities/types.ts'
import Container from './Container.vue'
import Button from './Button.vue'
import { storeToRefs } from 'pinia'
import { useCurrentItemsStore } from '@/stores/current_items.ts'

const store = useCurrentItemsStore()
const { unassignedItems } = storeToRefs(store)
const { claimItem } = store

defineProps<{
  items: Array<Item>
}>()
</script>
