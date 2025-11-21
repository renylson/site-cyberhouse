import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

export interface Plan {
  id: number;
  name: string;
  speed: string;
  price: number | string;
  status: string;
  features: string[];
  is_popular: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
}

interface PlansState {
  plans: Plan[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PlansState = {
  plans: [],
  isLoading: false,
  error: null,
};

export const fetchPlans = createAsyncThunk('plans/fetchPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/plans');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch plans');
  }
});

export const fetchAllPlans = createAsyncThunk('plans/fetchAllPlans', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/plans/admin/all');
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to fetch plans');
  }
});

export const createPlan = createAsyncThunk('plans/createPlan', async (planData: Partial<Plan>, { rejectWithValue }) => {
  try {
    const response = await api.post('/plans', planData);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to create plan');
  }
});

export const updatePlan = createAsyncThunk('plans/updatePlan', async ({ id, data }: { id: number; data: Partial<Plan> }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/plans/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to update plan');
  }
});

export const deletePlan = createAsyncThunk('plans/deletePlan', async (id: number, { rejectWithValue }) => {
  try {
    await api.delete(`/plans/${id}`);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.error || 'Failed to delete plan');
  }
});

const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
      })
      .addCase(createPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload);
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.plans = state.plans.filter(p => p.id !== action.payload);
      });
  },
});

export default plansSlice.reducer;
