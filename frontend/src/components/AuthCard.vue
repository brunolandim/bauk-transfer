<template>
  <div class="min-h-screen bg-violet-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-violet-600 rounded-2xl mb-4 shadow-lg">
          <svg class="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" />
          </svg>
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
