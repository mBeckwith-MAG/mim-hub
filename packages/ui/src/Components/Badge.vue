<template>
  <small
    :class="[
      'inline-flex items-center gap-1.5 border-2 rounded-full px-2 py-1 text-xs font-medium transition-colors',
      closable ? 'justify-between' : 'justify-center text-center',
      variantClasses[variant] || variantClasses.primary,
    ]"
  >
    <slot />

    <Icon
      v-if="closable"
      icon="fontisto:close"
      width="1em"
      class="cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
      @click="$emit('remove-badge')"
    />
  </small>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

type BadgeVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'caution'
  | 'warning'
  | 'info'
  | 'update'
  | 'danger';

interface Props {
  variant?: BadgeVariant;
  closable?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  closable: false,
});

defineEmits<{
  (e: 'remove-badge'): void;
}>();

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-blue-200 border-blue-400 text-blue-600',
  secondary: 'bg-gray-200 border-gray-400 text-gray-600',
  success: 'bg-emerald-200 border-emerald-400 text-emerald-600',
  caution: 'bg-yellow-200 border-yellow-400 text-yellow-600',
  warning: 'bg-orange-200 border-orange-400 text-orange-600',
  info: 'bg-sky-200 border-sky-400 text-sky-600',
  update: 'bg-purple-200 border-purple-400 text-purple-600',
  danger: 'bg-red-200 border-red-400 text-red-600',
};
</script>
