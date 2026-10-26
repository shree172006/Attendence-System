import { create } from 'zustand';
import { api } from '../api';
const mapBatch = (b) => ({ id: b.id, name: b.name, className: b.class_name, lectureType: b.lecture_type, startTime: b.start_time || '', endTime: b.end_time || '', enrolled: b.enrolled || 0 });
export const useBatchStore = create((set) => ({ batches: [], loading: false,
  loadBatches: async () => { set({ loading: true }); try { const data = await api.batches(); set({ batches: data.map(mapBatch) }); } finally { set({ loading: false }); } },
  addBatch: async (batch) => { const saved = await api.addBatch(batch); set((state) => ({ batches: [...state.batches, mapBatch(saved)] })); },
  deleteBatch: async (id) => { await api.deleteBatch(id); set((state) => ({ batches: state.batches.filter((b) => b.id !== id) })); },
}));
