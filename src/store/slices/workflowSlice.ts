import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkflowState {
  currentStep: number;
  currentStepIndex: number;
  completedSteps: number[];
  isValidating: boolean;
  workflowConfig: any;
  availabilityMode: string;
  steps: any[];
  stepData: Record<string, any>;
  isCompleted: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  currentStep: 0,
  currentStepIndex: 0,
  completedSteps: [],
  isValidating: false,
  workflowConfig: null,
  availabilityMode: 'simple',
  steps: [],
  stepData: {},
  isCompleted: false,
  loading: false,
  error: null,
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
      state.currentStepIndex = action.payload;
    },
    setCurrentStepIndex: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = action.payload;
    },
    setWorkflowConfig: (state, action: PayloadAction<any>) => {
      state.workflowConfig = action.payload;
    },
    setValidating: (state, action: PayloadAction<boolean>) => {
      state.isValidating = action.payload;
    },
    completeStep: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = action.payload;
      state.currentStep = action.payload;
    },
    updateStepData: (state, action: PayloadAction<any>) => {
      state.workflowConfig = { ...state.workflowConfig, ...action.payload };
    },
    setSteps: (state, action: PayloadAction<any[]>) => {
      state.steps = action.payload;
    },
    setStepData: (state, action: PayloadAction<{ step: string; data: any }>) => {
      state.stepData[action.payload.step] = action.payload.data;
    },
    setIsCompleted: (state, action: PayloadAction<boolean>) => {
      state.isCompleted = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.steps.length - 1) {
        state.currentStep += 1;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    resetWorkflow: (state) => {
      state.currentStep = 0;
      state.stepData = {};
      state.isCompleted = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentStep,
  setCurrentStepIndex,
  setWorkflowConfig,
  setValidating,
  completeStep,
  goToStep,
  updateStepData,
  setSteps,
  setStepData,
  setIsCompleted,
  nextStep,
  previousStep,
  resetWorkflow,
  setLoading,
  setError,
} = workflowSlice.actions;

export default workflowSlice.reducer;