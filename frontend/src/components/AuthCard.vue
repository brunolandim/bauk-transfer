<template>
  <div class="min-h-screen bg-violet-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-violet-600 rounded-2xl mb-4 shadow-lg">
          <ArrowsRightLeftIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-2xl font-bold text-slate-800">BAUK Transfer</h1>
        <p class="text-slate-500 text-sm mt-1">Transferências simples e rápidas</p>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowsRightLeftIcon } from '@heroicons/vue/24/outline'
</script>
