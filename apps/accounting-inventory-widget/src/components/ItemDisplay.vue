<template>
  <Card v-if="itemData">
    <template #title>
      <div class="text-4xl">
        {{ itemData.store_name?.text?.toUpperCase() }} - {{ item.name }}
      </div>
      <div>
        <Badge :variant="statusVari"
          >STATUS: {{ itemData.status?.text?.toUpperCase() }}</Badge
        >
        <Badge :variant="prioVari"
          >PRIORITY: {{ itemData.priority?.text?.toUpperCase() }}</Badge
        >
      </div>
    </template>
    <template #body>
      <Container>
        <div class="grid gap-4">
          <div
            v-if="itemData.attachments?.text"
            class="flex justify-start gap-md"
          >
            <Attachment
              v-for="(attachment, index) in itemData.attachments.text.split(
                ','
              )"
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
                  <div>
                    {{
                      itemData.new_origin?.text || itemData.used_origin?.text
                    }}
                  </div>
                </div>
              </template>
            </Card>
            <Card>
              <template #title>NOTES</template>
              <template #body>{{
                itemData.form_notes?.text || 'No Notes'
              }}</template>
            </Card>
            <Card>
              <template #title>OTHER INPUTS</template>
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
      <Button variant="success" @click="handleDone">DONE</Button>
      <Button variant="danger" @click="handleReject">REJECT</Button>
      <Button variant="update" @click="handleMissingVendor"
        >MISSING VENDOR</Button
      >
    </template>
  </Card>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CurrentBoardColumns } from '@mim-workspace/constants';
import type { Item } from '@mim-workspace/types';
import { InventoryItem } from '@mim-workspace/models';

import { Icon } from '@iconify/vue';

import { Badge, Button, Card, Container } from '@mim-workspace/ui';

const store = useCurrentItemsStore();
const { getItemData } = store;

const itemData = ref<InventoryItem | null>(null);

const props = defineProps<{
  item: Item;
}>();

onMounted(async () => {
  const data = (await getItemData(props.item).then(
    (res) => res
  )) as (typeof CurrentBoardColumns)[];
  itemData.value = new InventoryItem(data, CurrentBoardColumns);
});

const statusVari = computed(() => {
  if (itemData.value?.status?.text?.includes('Missing')) return 'warning';
  if (itemData.value?.status?.text?.includes('Reject')) return 'danger';
  if (itemData.value?.status?.text?.includes('Done')) return 'success';
  if (itemData.value?.status?.text?.includes('Working')) return 'caution';
  return 'secondary';
});

const prioVari = computed(() => {
  if (itemData.value?.priority?.text?.includes('Critical')) return 'danger';
  if (itemData.value?.priority?.text?.includes('High')) return 'warning';
  if (itemData.value?.priority?.text?.includes('Medium')) return 'caution';
  return 'secondary';
});

function handleDone() {
  console.log('Item is DONE!');
}
function handleReject() {
  console.log('Item is REJECTED!');
}
function handleMissingVendor() {
  console.log('Item is MISSING the VENDOR!');
}
</script>
