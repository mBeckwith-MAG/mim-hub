<template>
  <Card v-if="itemData">
    <template #title>
      <div class="text-4xl">{{ itemData.STORE.text?.toUpperCase() }} - {{ item.name }}</div>
      <div>
        <Badge :variant="statusVari">STATUS {{ itemData.STATUS.text?.toUpperCase() }}</Badge>
        <Badge :variant="prioVari">PRIORITY {{ itemData.PRIORITY.text?.toUpperCase() }}</Badge>
      </div>
    </template>
    <template #body>
      <Container>
        <div class="grid gap-4">
          <div v-if="itemData.ATTACHMENTS.text" class="flex justify-start gap-md">
            <Attachment
              v-for="(attachment, index) in itemData.ATTACHMENTS.text.split(',')"
              :key="`${item.id}-attachment-${index}`"
              :attachment
            />
          </div>
          <div v-else>No Attachments</div>

          <div class="grid grid-cols-3 gap-md">
            <Card>
              <template #title>General Information</template>
              <template #body>
                <div class="flex justify-start gap-md">
                  <div>ORIGIN</div>
                  <div>{{ itemData.NEW_ORIGIN.text || itemData.USED_ORIGIN.text }}</div>
                </div>
              </template>
            </Card>
            <Card>
              <template #title>Notes</template>
              <template #body>{{ itemData.FORM_NOTES.text || 'No Notes' }}</template>
            </Card>
            <Card>
              <template #title>Other Inputs</template>
              <template #body>
                <div
                  v-for="[key, value] in Object.entries(itemData)"
                  :class="[
                    'row',
                    {
                      hidden:
                        !value.text ||
                        key === 'STORE' ||
                        key === 'STATUS' ||
                        key === 'PRIORITY' ||
                        key === 'ATTACHMENTS' ||
                        key === 'FORM_NOTES',
                    },
                  ]"
                >
                  <div>{{ key }}</div>
                  <div>{{ value.text }}</div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </Container>
    </template>
    <template #footer>
      <StatusButtons :item />
    </template>
  </Card>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue'
import { ColumnValues, Item } from '@/utilities/types.ts'
import { InventoryItem } from '@/utilities/models.ts'
import { useCurrentItemsStore } from '@/stores/current_items.ts'
import { Icon } from '@iconify/vue'

import Badge from './Badge.vue'
import Card from './Card.vue'
import Container from './Container.vue'
import StatusButtons from './StatusButtons.vue'
import Attachment from './Attachment.vue'

const store = useCurrentItemsStore()
const { getItemData } = store

const itemData: Ref<InventoryItem | null> = ref(null)

const props = defineProps<{
  item: Item
}>()

onMounted(async () => {
  const data = (await getItemData(props.item).then((res) => res)) as ColumnValues[]
  itemData.value = new InventoryItem(data)
})

const statusVari = computed(() => {
  if (itemData.value?.STATUS.text?.includes('Missing')) return 'warning'
  if (itemData.value?.STATUS.text?.includes('Reject')) return 'danger'
  if (itemData.value?.STATUS.text?.includes('Done')) return 'success'
  if (itemData.value?.STATUS.text?.includes('Working')) return 'caution'
  return 'secondary'
})

const prioVari = computed(() => {
  if (itemData.value?.PRIORITY.text?.includes('Critical')) return 'danger'
  if (itemData.value?.PRIORITY.text?.includes('High')) return 'warning'
  if (itemData.value?.PRIORITY.text?.includes('Medium')) return 'caution'
  return 'secondary'
})
</script>
