<template>
  <div class="min-h-screen bg-slate-50">
    <header class="bg-violet-700 shadow-md">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-violet-500 rounded-xl flex items-center justify-center shadow">
            <svg class="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 3M21 7.5H7.5" />
            </svg>
          </div>
          <span class="text-white font-bold text-lg tracking-tight">BAUK Transfer</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-violet-200 text-sm font-medium hidden sm:block">@{{ currentUsername }}</span>
          <button
            @click="handleLogout"
            class="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition cursor-pointer"
          >
            Sair
          </button>
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
          <button
            @click="fetchBalance"
            :disabled="balanceLoading"
            class="mt-4 self-start text-xs text-violet-600 hover:text-violet-800 font-medium disabled:text-violet-300 transition cursor-pointer"
          >
            ↻ Atualizar saldo
          </button>
        </div>

        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 class="text-base font-semibold text-slate-700 mb-4">Nova Transferência</h2>
          <form @submit.prevent="handleTransfer" class="space-y-3">
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Destinatário</label>
              <input
                v-model="transferUsername"
                type="text"
                placeholder="usuario"
                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-500 mb-1">Valor (R$)</label>
              <input
                v-model="transferAmount"
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                class="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
              />
            </div>

            <BaseButton type="submit" label="Transferir" loading-text="Enviando..." :loading="transferLoading" />
          </form>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 class="text-base font-semibold text-slate-700">Transações</h2>
          <div class="flex flex-wrap items-center gap-2">
            <input
              v-model="filterDate"
              type="date"
              class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            />
            <select
              v-model="filterType"
              class="px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
            >
              <option value="">Todos</option>
              <option value="cash-in">Cash-in</option>
              <option value="cash-out">Cash-out</option>
            </select>
            <button
              @click="applyFilters"
              class="px-3 py-1.5 text-sm bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition cursor-pointer"
            >
              Filtrar
            </button>
            <button
              @click="clearFilters"
              class="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-lg transition cursor-pointer"
            >
              Limpar
            </button>
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
                v-for="tx in transactions"
                :key="tx.id"
                class="border-b border-slate-50 hover:bg-slate-50 transition"
              >
                <td class="py-3 px-4">
                  <span
                    :class="[
                      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
                      txType(tx) === 'cash-in' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700',
                    ]"
                  >
                    {{ txType(tx) === 'cash-in' ? '↓ Cash-in' : '↑ Cash-out' }}
                  </span>
                </td>
                <td class="py-3 px-4 text-slate-600 whitespace-nowrap text-sm">
                  {{ txType(tx) === 'cash-in' ? `@${tx.debitedUsername}` : `@${tx.creditedUsername}` }}
                </td>
                <td class="py-3 px-4 text-slate-500 whitespace-nowrap">{{ formatDate(tx.createdAt) }}</td>
                <td
                  :class="[
                    'py-3 px-4 text-right font-semibold whitespace-nowrap',
                    txType(tx) === 'cash-in' ? 'text-emerald-600' : 'text-red-600',
                  ]"
                >
                  {{ txType(tx) === 'cash-in' ? '+' : '-' }}{{ formatBRL(Number(tx.value)) }}
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
import BaseButton from '../components/BaseButton.vue'

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

function txType(tx: Transaction): 'cash-in' | 'cash-out' {
  return tx.creditedAccountId === currentAccountId.value ? 'cash-in' : 'cash-out'
}

function handleLogout() {
  logout()
  router.push('/login')
}

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
