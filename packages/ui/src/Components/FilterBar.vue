<template>
  <div class="fixed top-30 left-0 right-0 z-40">
    <Container
      :class="[
        'relative w-full bg-mid z-40 transition-all shadow-md shadow-mid border-b border-dark',
        styles,
      ]"
    >
      <Grid>
        <div class="grid grid-cols-4 items-center">
          <FormInput
            v-model="searchQuery"
            name="search"
            placeholder="Search..."
            class="relative -top-2 col-span-3 bg-light rounded-2xl p-sm"
            forceLabel
          >
            <template #default>Search</template>
          </FormInput>
          <Button variant="secondary" outlined>CLEAR</Button>
        </div>

        <Grid :cols="5">
          <div
            v-for="(dropdown, index) in dropdowns"
            class="bg-light rounded-2xl border border-mid"
          >
            <Dropdown
              :key="`${dropdown.name}-dropdown-${index}`"
              :name="dropdown.name"
              :options="dropdown.options"
              v-model="filters[dropdown.name]"
              class="relative after:absolute after:-bottom-2 after:left-0 after:h-lg after:w-full after:bg-light after:rounded-2xl"
              forceLabel
            >
              <template #default>{{ dropdown.label }}</template>
            </Dropdown>
          </div>
        </Grid>
        <div
          v-if="horizontal"
          class="w-full md:w-auto p-0.5 relative cursor-pointer text-txt/70 hover:text-txt transition-colors text-center"
          @click="toggleShow"
        >
          <Icon :icon="currentIcon" class="mx-auto w-6 h-6" />
        </div>
      </Grid>
    </Container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import type { FilterDropdown } from '../../../types';
import { Button, Dropdown, FormInput } from '../Components';
import { Container, Grid } from '../Layouts';

interface Props {
  dropdowns: Array<FilterDropdown>;
  horizontal?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: false,
});

const show = ref(false);
const searchQuery = defineModel<string>('search', { default: '' });
const filters = defineModel<Record<string, any>>('filters', {
  default: () => ({}),
});

const styles = computed(() => {
  if (!props.horizontal) {
    return show.value ? 'left-0' : '-left-100';
  }
  return show.value ? 'top-0' : '-top-50';
});

const toggleShow = () => {
  show.value = !show.value;
};

const currentIcon = computed(() => {
  if (!props.horizontal) {
    return show.value ? 'mdi:chevron-right' : 'mdi:chevron-left';
  }
  return show.value ? 'mdi:chevron-up' : 'mdi:chevron-down';
});
</script>
