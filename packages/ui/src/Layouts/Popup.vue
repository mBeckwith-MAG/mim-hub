<template>
  <div
    class="fixed top-0 left-0 h-full w-full bg-black/80 z-100 flex justify-center items-center"
  >
    <div>
      <Card class="bg-light text-txt min-w-200 min-h-80">
        <template #title>
          <div
            class="text-2xl font-thin flex justify-between items-center w-full"
          >
            <div>{{ title }}</div>
            <div>
              <Button variant="basic" @click="$emit('close')">
                <Icon icon="carbon:close-large" width="1em" />
              </Button>
            </div>
          </div>
        </template>
        <template #body>
          <Container>
            <div>{{ description }}</div>
            <FormTextarea name="inventory" v-model="notes">Notes</FormTextarea>
          </Container>
        </template>
        <template #footer>
          <Button variant="success" outlined @click="handleConfirm"
            >CONFIRM</Button
          >
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Button, FormTextarea } from '../Components';
import Card from './Card.vue';
import Container from './Container.vue';
import type { PopupData } from '../../../types';
import { Icon } from '@iconify/vue/dist/iconify.js';

const props = defineProps<PopupData>();
const emits = defineEmits(['close', 'confirm']);

const notes = ref('');

const status = computed(() => {
  if (props.title.toLowerCase().includes('rejection')) return 'Reject';
  if (props.title.toLowerCase().includes('missing')) return 'Missing Vendor';
  return 'Done';
});

function handleConfirm() {
  if (notes.value) {
    emits('confirm', {
      status: status.value,
      notes: notes.value,
      item: props.item,
    });
  }
}
</script>
