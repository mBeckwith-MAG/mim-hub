<template>
  <div class="text-center">
    <div class="truncate">
      {{ formattedDate }}
    </div>
    <small>
      <slot />
    </small>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps({
  date: {
    type: String,
    required: true,
  },
});

const formattedDate = computed(() => {
  if (!props.date) return '-';
  const dateData = props.date.split('-');
  let [_, month, day] = dateData;

  if (day.split(' ').length > 1) {
    const [dayDate, time] = day.split(' ');
    let [hour, minutes] = time.split(':');
    let code = 'AM';

    if (Number(hour) > 12) {
      hour = String(Number(hour) - 12);
      code = 'PM';
    }
    const newTime = `${[String(Number(hour)), minutes].join(':')}${code}`;
    day = [dayDate, newTime].join(' ');
  }
  return [month, day].join('/');
});
</script>
