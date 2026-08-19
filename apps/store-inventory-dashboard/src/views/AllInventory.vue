<template>
  <div v-if="loading" class="title">Loading...</div>
  <div v-else>
    <Navigation class="py-0.75 px-4">
      <template #left>All Inventory</template>
      <template #right>
        <RouterLink to="/inventory/add-vehicle">
          <ButtonAddIcon width="4em" class="btn secondary outlined" />
        </RouterLink>
      </template>
    </Navigation>
    <Container>
      <div v-if="allItems.length">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ItemCard v-for="item in allItems" :item :key="item.uid" class="mb-8" />
        </div>
      </div>
      <div v-else class="title">No Items</div>
    </Container>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'
import { BASE_URL, BOARDS } from '../utilities/constants'
import type { Item } from '../utilities/types'
import { InventoryItem } from '../utilities/models'
import ItemCard from '../components/ItemCard.vue'

const loading = ref(true)
const allItems: Ref<InventoryItem[]> = ref([])

onMounted(async () => {
  const { items } = await fetch(`${BASE_URL}/boards/${BOARDS.currentItems}`).then((res) =>
    res.json(),
  )

  allItems.value = items
    .map((item: Item) => {
      return new InventoryItem(item)
    })
    .sort((a: InventoryItem, b: InventoryItem) => {
      if (a.created_date?.text && b.created_date?.text) {
        return a.created_date?.text?.localeCompare(b.created_date?.text)
      }
    })

  loading.value = false
})
</script>
