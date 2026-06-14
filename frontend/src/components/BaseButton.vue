<template>
  <button
    :type="type"
    :disabled="loading || disabled"
    class="w-full py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition text-sm cursor-pointer"
  >
    {{ loading ? loadingText : label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  loadingText?: string
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>
