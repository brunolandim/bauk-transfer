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

      <BaseInput v-model="password" label="Senha" :type="showPassword ? 'text' : 'password'" placeholder="Digite sua senha" autocomplete="new-password">
        <template #icon>
          <button type="button" @click="showPassword = !showPassword" class="text-slate-400 hover:text-slate-600 transition cursor-pointer">
            <EyeSlashIcon v-if="showPassword" class="w-4 h-4" />
            <EyeIcon v-else class="w-4 h-4" />
          </button>
        </template>
      </BaseInput>

      <div>
        <BaseInput v-model="confirmPassword" label="Confirmar senha" :type="showConfirm ? 'text' : 'password'" placeholder="Repita a senha" autocomplete="new-password">
          <template #icon>
            <button type="button" @click="showConfirm = !showConfirm" class="text-slate-400 hover:text-slate-600 transition cursor-pointer">
              <EyeOffIcon v-if="showConfirm" />
              <EyeIcon v-else />
            </button>
          </template>
        </BaseInput>
        <p v-if="confirmPassword && !passwordsMatch" class="text-xs text-red-500 mt-1">As senhas não coincidem</p>

        <div class="mt-3 space-y-1">
          <span :class="['text-xs flex items-center gap-1.5', hasMinLength ? 'text-emerald-600' : 'text-slate-400']">
            <CheckIcon v-if="hasMinLength" class="w-3 h-3" />
            <MinusIcon v-else class="w-3 h-3" />
            Mínimo 8 caracteres
          </span>
          <span :class="['text-xs flex items-center gap-1.5', hasUppercase ? 'text-emerald-600' : 'text-slate-400']">
            <CheckIcon v-if="hasUppercase" class="w-3 h-3" />
            <MinusIcon v-else class="w-3 h-3" />
            Pelo menos 1 letra maiúscula
          </span>
          <span :class="['text-xs flex items-center gap-1.5', hasNumber ? 'text-emerald-600' : 'text-slate-400']">
            <CheckIcon v-if="hasNumber" class="w-3 h-3" />
            <MinusIcon v-else class="w-3 h-3" />
            Pelo menos 1 número
          </span>
        </div>
      </div>

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
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { toast } from 'vue-sonner'
import { register } from '../api'
import AuthCard from '../components/AuthCard.vue'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import { EyeIcon, EyeSlashIcon, CheckIcon, MinusIcon } from '@heroicons/vue/24/outline'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirm = ref(false)
const loading = ref(false)
const success = ref(false)

const hasUppercase = computed(() => /[A-Z]/.test(password.value))
const hasNumber = computed(() => /\d/.test(password.value))
const hasMinLength = computed(() => password.value.length >= 8)
const passwordsMatch = computed(() => password.value === confirmPassword.value)

async function handleRegister() {
  if (!passwordsMatch.value) {
    toast.error('As senhas não coincidem')
    return
  }
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
