<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    :class="['w-full px-4 py-2 text-sm font-medium transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed', variantClass]"
  >
    {{ loading ? loadingText : label }}
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  loadingText?: string
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'ghost'
}>()
const variantClass = computed(() => {
  switch (props.variant) {
    case 'primary': return 'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl'
    case 'secondary': return 'bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl'
    case 'ghost': return 'text-violet-600 hover:text-violet-800'
    default: return 'bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl'
  }
})
</script>
