<template>
  <AuthCard>
    <h2 class="text-xl font-semibold text-slate-700 mb-6">Criar conta</h2>

    <div
      v-if="success"
      class="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm mb-4"
    >
      <span>✅</span>
      <span>Conta criada! Faça login para continuar.</span>
    </div>

    <form v-if="!success" @submit.prevent="handleRegister" class="space-y-4">
      <BaseInput v-model="username" label="Usuário" placeholder="seunome (mín. 3 caracteres)" autocomplete="username" />
      <BaseInput v-model="password" label="Senha" type="password" placeholder="Mín. 8 chars, 1 maiúscula, 1 número" autocomplete="new-password" />
      <BaseButton type="submit" label="Criar conta" loading-text="Criando conta..." :loading="loading" />
    </form>

    <p class="text-center text-sm text-slate-500 mt-6">
      Já tem conta?
      <RouterLink to="/login" class="text-violet-600 font-semibold hover:underline">
        Entrar
      </RouterLink>
    </p>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import { register } from '../api'
import AuthCard from '../components/AuthCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'

const username = ref('')
const password = ref('')
const loading = ref(false)
const success = ref(false)

async function handleRegister() {
  loading.value = true
  try {
    await register(username.value, password.value)
    success.value = true
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Erro ao criar conta')
  } finally {
    loading.value = false
  }
}
</script>
