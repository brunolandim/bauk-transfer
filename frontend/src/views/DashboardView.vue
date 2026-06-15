<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-violet-700 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center shadow">
            <ArrowsRightLeftIcon class="w-5 h-5 text-white" />
          </div>
          <span class="text-white font-bold text-lg tracking-tight">BAUK Transfer</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-violet-200 text-sm font-medium hidden sm:block">@{{ currentUsername }}</span>
          <div class="w-fit">
            <BaseButton label="Sair" variant="primary" @click="handleLogout" />
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-8 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between min-h-40">
          <div>
            <p class="text-sm font-medium text-slate-500">Saldo disponível</p>
            <div class="mt-3">
              <p v-if="balanceLoading" class="text-4xl font-bold text-slate-200 animate-pulse select-none">
                R$ ••••
              </p>
              <p v-else class="text-4xl font-bold text-slate-800">
                {{ formatBRL(balance) }}
              </p>
            </div>
          </div>
          <div class="mt-4 w-fit">
            <BaseButton label="↻ Atualizar saldo" variant="ghost" :disabled="balanceLoading" @click="fetchBalance" />
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 class="text-base font-semibold text-slate-700 mb-4">Nova Transferência</h2>
          <form @submit.prevent="handleTransfer" class="space-y-3">
            <BaseInput v-model="transferUsername" label="Destinatário" placeholder="usuario" />
            <BaseInput v-model="transferAmount" label="Valor (R$)" type="number" placeholder="0.00" />
            <BaseButton type="submit" label="Transferir" loading-text="Enviando..." :loading="transferLoading" />
          </form>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 class="text-base font-semibold text-slate-700">Transações</h2>
          <div class="flex items-center gap-2">
            <BaseInput v-model="filterDate" label="" type="date" />
            <select
              v-model="filterType"
              class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            >
              <option value="">Todos</option>
              <option value="cash-in">Cash-in</option>
              <option value="cash-out">Cash-out</option>
            </select>
            <BaseButton label="Filtrar" variant="primary" @click="applyFilters" />
            <BaseButton label="Limpar" variant="secondary" @click="clearFilters" />
          </div>
        </div>

        <div v-if="transactionsLoading" class="py-12 text-center text-slate-400 text-sm">
          Carregando transações...
        </div>
        <div v-else-if="transactions.length === 0" class="py-12 text-center">
          <p class="text-slate-400 text-sm">Nenhuma transação encontrada.</p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Tipo</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Contraparte</th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Data</th>
                <th class="text-right py-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wide">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in transactions"
                :key="transaction.id"
                class="border-b border-slate-50 hover:bg-slate-50 transition"
              >
                <td class="py-3 px-4">
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                      transactionType(transaction) === 'cash-in' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
                    ]"
                  >
                    {{ transactionType(transaction) === 'cash-in' ? '↓ Cash-in' : '↑ Cash-out' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-600 whitespace-nowrap text-sm">
                  {{ transactionType(transaction) === 'cash-in' ? `@${transaction.debitedUsername}` : `@${transaction.creditedUsername}` }}
                </td>
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">{{ formatDate(transaction.createdAt) }}</td>
                <td
                  :class="[
                    'py-3 px-4 text-right font-semibold whitespace-nowrap',
                    transactionType(transaction) === 'cash-in' ? 'text-emerald-600' : 'text-red-600',
                  ]"
                >
                  {{ transactionType(transaction) === 'cash-in' ? '+' : '-' }}{{ formatBRL(Number(transaction.value)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { type Transaction, getBalance, getTransactions, transfer, logout, getAccountId, getUsername } from '../api'
import { formatBRL, formatDate } from '../utils/format'
import BaseButton from '../components/BaseButton.vue'
import BaseInput from '../components/BaseInput.vue'
import { ArrowsRightLeftIcon } from '@heroicons/vue/24/outline'

const router = useRouter()

const currentUsername = ref('')
const currentAccountId = ref('')
const balance = ref(0)
const balanceLoading = ref(false)
const transferUsername = ref('')
const transferAmount = ref('')
const transferLoading = ref(false)
const transactions = ref<Transaction[]>([])
const transactionsLoading = ref(false)
const filterDate = ref('')
const filterType = ref<'' | 'cash-in' | 'cash-out'>('')

onMounted(async () => {
  currentUsername.value = getUsername()
  currentAccountId.value = getAccountId()
  await Promise.all([fetchBalance(), fetchTransactions()])
})

async function fetchBalance() {
  balanceLoading.value = true
  try {
    balance.value = await getBalance()
  } catch {
    toast.error('Não foi possível carregar o saldo')
  } finally {
    balanceLoading.value = false
  }
}

async function fetchTransactions(filters: { date?: string; type?: 'cash-in' | 'cash-out' } = {}) {
  transactionsLoading.value = true
  try {
    transactions.value = await getTransactions(filters)
  } catch {
    toast.error('Não foi possível carregar as transações')
  } finally {
    transactionsLoading.value = false
  }
}

async function handleTransfer() {
  const amount = parseFloat(transferAmount.value)
  if (!transferUsername.value.trim() || isNaN(amount) || amount <= 0) {
    toast.error('Preencha todos os campos corretamente')
    return
  }

  transferLoading.value = true
  try {
    await transfer(transferUsername.value.trim(), amount)
    toast.success(`Transferência de ${formatBRL(amount)} realizada com sucesso!`)
    transferUsername.value = ''
    transferAmount.value = ''
    await Promise.all([fetchBalance(), fetchTransactions()])
  } catch (e) {
    toast.error(e instanceof Error ? e.message : 'Erro ao realizar transferência')
  } finally {
    transferLoading.value = false
  }
}

function applyFilters() {
  const filters: { date?: string; type?: 'cash-in' | 'cash-out' } = {}
  if (filterDate.value) filters.date = filterDate.value
  if (filterType.value) filters.type = filterType.value
  fetchTransactions(filters)
}

function clearFilters() {
  filterDate.value = ''
  filterType.value = ''
  fetchTransactions()
}

function transactionType(transaction: Transaction): 'cash-in' | 'cash-out' {
  return transaction.creditedAccountId === currentAccountId.value ? 'cash-in' : 'cash-out'
}

function handleLogout() {
  logout()
  router.push('/login')
}
</script>
