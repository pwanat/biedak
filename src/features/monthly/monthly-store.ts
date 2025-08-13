import { create } from 'zustand'
import { Expense } from '~/models/expense'
import { Income } from '~/models/income'

type DialogType = 'create' | 'update' | 'delete' | 'import' | 'income-create' | 'income-update'

interface MonthlyStore {
  // State
  dialogOpen: DialogType | null
  currentExpense: Expense | null
  currentIncome: Income | null // Assuming Income type is defined similarly to Expense

  // Actions
  setDialogOpen: (type: DialogType | null) => void
  setCurrentExpense: (expense: Expense | null) => void
  setCurrentIncome: (income: Income | null) => void
  reset: () => void
}

export const useMonthlyStore = create<MonthlyStore>((set) => ({
  // Initial state
  dialogOpen: null,
  currentExpense: null,
  currentIncome: null,

  // Actions
  setDialogOpen: (type) => set({ dialogOpen: type }),
  setCurrentExpense: (expense) => set({ currentExpense: expense }),
  setCurrentIncome: (income) => set({ currentIncome: income }),
  reset: () => set({ dialogOpen: null, currentExpense: null, currentIncome: null }),
}))
