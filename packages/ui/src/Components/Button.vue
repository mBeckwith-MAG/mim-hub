<template>
  <button
    :disabled="disabled"
    :type="type"
    :class="[
      'flex justify-center m-4 text-lg p-4 text-center items-center rounded-2xl transition-colors',
      disabled ? 'opacity-10 cursor-default' : 'cursor-pointer',
      !outlined ? filledVariants[variant] : outlinedVariants[variant],
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'caution'
  | 'warning'
  | 'info'
  | 'update'
  | 'danger';

interface Props {
  variant?: ButtonVariant;
  outlined?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  outlined: false,
  disabled: false,
  type: 'button',
});

const filledVariants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-400 text-white enabled:hover:bg-blue-500',
  secondary: 'bg-gray-400 text-white enabled:hover:bg-gray-500',
  success: 'bg-emerald-400 text-white enabled:hover:bg-emerald-500',
  caution: 'bg-yellow-400 text-white enabled:hover:bg-yellow-500',
  warning: 'bg-orange-400 text-white enabled:hover:bg-orange-500',
  info: 'bg-sky-400 text-white enabled:hover:bg-sky-500',
  update: 'bg-purple-400 text-white enabled:hover:bg-purple-500',
  danger: 'bg-red-400 text-white enabled:hover:bg-red-500',
};

const outlinedVariants: Record<ButtonVariant, string> = {
  primary:
    'bg-transparent border border-blue-400 text-blue-400 font-semibold enabled:hover:bg-blue-300',
  secondary:
    'bg-transparent border border-gray-400 text-gray-400 font-semibold enabled:hover:bg-gray-300 enabled:hover:text-dark',
  success:
    'bg-transparent border border-emerald-400 text-emerald-400 font-semibold enabled:hover:bg-emerald-300',
  caution:
    'bg-transparent border border-yellow-400 text-yellow-400 font-semibold enabled:hover:bg-yellow-300',
  warning:
    'bg-transparent border border-orange-400 text-orange-400 font-semibold enabled:hover:bg-orange-300',
  info: 'bg-transparent border border-sky-400 text-sky-400 font-semibold enabled:hover:bg-sky-300',
  update:
    'bg-transparent border border-purple-400 text-purple-400 font-semibold enabled:hover:bg-purple-300',
  danger:
    'bg-transparent border border-red-400 text-red-400 font-semibold enabled:hover:bg-red-300',
};
</script>
