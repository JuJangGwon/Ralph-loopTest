import { create } from 'zustand';

const initialState = {
  name: '',
  region: '',
  job: '',
  income: '',
};

export const useFunnelStore = create((set) => ({
  ...initialState,
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  reset: () => set(() => ({ ...initialState })),
}));
