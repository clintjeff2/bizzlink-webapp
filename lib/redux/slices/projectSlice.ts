import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Project {
  id: string
  title: string
  description: string
  budget: number
  deadline: string
  skills: string[]
  clientId: string
  clientName: string
  status: 'open' | 'in-progress' | 'completed' | 'cancelled'
  proposals: number
  createdAt: string
  updatedAt: string
}

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  filters: {
    status?: string
    skills?: string[]
    budget?: { min: number; max: number }
  }
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  filters: {}
}

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload
      state.error = null
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload)
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload
      }
    },
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.loading = false
    },
    setFilters: (state, action: PayloadAction<Partial<ProjectState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    }
  }
})

export const {
  setLoading,
  setProjects,
  addProject,
  updateProject,
  setCurrentProject,
  setError,
  setFilters,
  clearFilters
} = projectSlice.actions

export default projectSlice.reducer
