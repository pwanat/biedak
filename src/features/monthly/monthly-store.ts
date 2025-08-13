import { create } from 'zustand'
import { Expense } from '~/models/expense'

type DialogType = 'create' | 'update' | 'delete' | 'import'

interface MonthlyStore {
  // State
  dialogOpen: DialogType | null
  currentExpense: Expense | null

  // Actions
  setDialogOpen: (type: DialogType | null) => void
  setCurrentExpense: (expense: Expense | null) => void
  reset: () => void
}

export const useMonthlyStore = create<MonthlyStore>((set) => ({
  // Initial state
  dialogOpen: null,
  currentExpense: null,

  // Actions
  setDialogOpen: (type) => set({ dialogOpen: type }),
  setCurrentExpense: (expense) => set({ currentExpense: expense }),
  reset: () => set({ dialogOpen: null, currentExpense: null }),
}))
