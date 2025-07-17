import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  duration: number;
}

export interface BookingState {
  availableSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  availableSlots: [
    { id: '1', time: '09:00', available: true, duration: 30 },
    { id: '2', time: '10:00', available: true, duration: 30 },
    { id: '3', time: '11:00', available: false, duration: 30 },
    { id: '4', time: '14:00', available: true, duration: 30 },
    { id: '5', time: '15:00', available: true, duration: 30 },
    { id: '6', time: '16:00', available: true, duration: 30 },
  ],
  selectedSlot: null,
  loading: false,
  error: null,
};

export const createBookingSlot = createAsyncThunk(
  'booking/createSlot',
  async (slotData: { time: string; duration: number }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: Date.now().toString(),
      time: slotData.time,
      available: true,
      duration: slotData.duration,
    };
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    selectSlot: (state, action: PayloadAction<string>) => {
      state.selectedSlot = state.availableSlots.find(slot => slot.id === action.payload) || null;
    },
    clearSelectedSlot: (state) => {
      state.selectedSlot = null;
    },
    toggleSlotAvailability: (state, action: PayloadAction<string>) => {
      const slot = state.availableSlots.find(slot => slot.id === action.payload);
      if (slot) {
        slot.available = !slot.available;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingSlot.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBookingSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.availableSlots.push(action.payload);
      })
      .addCase(createBookingSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking slot';
      });
  },
});

export const { selectSlot, clearSelectedSlot, toggleSlotAvailability } = bookingSlice.actions;
export default bookingSlice.reducer;