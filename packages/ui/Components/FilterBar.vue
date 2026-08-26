<template>
  <div :class="['filter-bar', styles, { horizontal: horizontal }]">
    <div class="relative top-4">
      <input
        name="item-search"
        id="item-search"
        type="text"
        v-model="model"
        placeholder="Search..."
        class="flex"
      />
      <button
        id="clearBtn"
        :class="[
          'absolute top-2 right-5 text-txt cursor-pointer',
          { hidden: showClearBtn },
        ]"
        @click="model = ''"
      >
        X
      </button>
    </div>
    <Dropdown
      v-for="(dropdown, index) in dropdowns"
      :key="`${dropdown.name}-dropdown-${index}`"
      :name="dropdown.name"
      :options="dropdown.options"
      v-model="model"
    >
      {{ dropdown.label }}
    </Dropdown>
    <div v-if="horizontal" class="toggle" @click="toggleShow" />
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import Dropdown from './Dropdown.vue';
import type { FilterDropdown } from '../../types';

const show = ref(false);

const model = defineModel();

const props = withDefaults(
  defineProps<{
    dropdowns: Array<FilterDropdown>;
    horizontal?: boolean;
  }>(),
  {
    horizontal: false,
  }
);

const styles = computed(() => {
  if (props.horizontal) {
    if (show.value) {
      return 'top-25';
    }
    return 'top-5';
  }
});

const showClearBtn = computed(() => {
  return model.value ? false : true;
});

const toggleShow = () => {
  show.value = !show.value;
};
</script>
