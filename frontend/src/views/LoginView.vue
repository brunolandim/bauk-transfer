<template>
  <AuthCard>
    <h2 class="text-xl font-semibold text-slate-700 mb-6">Entrar na sua conta</h2>

    <form @submit.prevent="handleLogin" class="space-y-4">
      <BaseInput v-model="username" label="Usuário" placeholder="seunome" autocomplete="username" />
      <BaseInput v-model="password" label="Senha" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" autocomplete="current-password">
        <template #icon>
          <button type="button" @click="showPassword = !showPassword" class="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <EyeSlashIcon v-if="showPassword" class="w-4 h-4" />
            <EyeIcon v-else class="w-4 h-4" />
          </button>
        </template>
      </BaseInput>
      <BaseButton type="submit" label="Entrar" loading-text="Entrando..." :loading="loading" />
    </form>

    <p class="text-center text-sm text-slate-500 mt-6">
      Não tem conta?
      <RouterLink to="/register" class="text-violet-600 font-semibold hover:underline">
        Cadastre-se
      </RouterLink>
    </p>
  </AuthCard>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import { login } from '../api'
import AuthCard from '../components/AuthCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleLogin() {
  loading.value = true
  try {
    await login(username.value, password.value)
    router.push('/')
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Erro ao fazer login')
  } finally {
    loading.value = false
  }
}
</script>
