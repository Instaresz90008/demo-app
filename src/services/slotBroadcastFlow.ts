// Simplified slot broadcast flow service
export const slotBroadcastFlow = {
  createSlot: (data: any) => Promise.resolve({ id: '1', ...data }),
  updateSlot: (id: string, data: any) => Promise.resolve({ id, ...data }),
  deleteSlot: (id: string) => Promise.resolve(),
  getSlots: () => Promise.resolve([]),
};