<template>
  <div>
    <label class="block text-sm font-medium text-slate-600 mb-1.5">{{ label }}</label>
    <div class="relative">
      <input
        :value="modelValue"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        class="w-full px-4 py-2 text-sm rounded-xl border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        :class="{ 'pr-10': $slots.icon }"
      />
      <div v-if="$slots.icon" class="absolute right-3 top-1/2 -translate-y-1/2">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  type?: string
  placeholder?: string
  autocomplete?: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
