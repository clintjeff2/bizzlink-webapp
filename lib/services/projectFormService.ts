import type { Project, ProjectAttachment, ProjectMilestone } from '@/lib/redux/types/firebaseTypes'
import { uploadProjectRequirementFiles, type FileUploadResult } from './storageService'

export interface ProjectFormData {
  // Basic Information
  title: string
  category: string
  subcategory: string
  description: string
  projectType: 'one-time' | 'ongoing' | 'contract'
  
  // Requirements
  requirements: string
  skills: string[]
  experienceLevel: 'entry' | 'intermediate' | 'expert'
  freelancerType: 'individual' | 'team'
  location: 'remote' | 'onsite' | 'hybrid'
  attachments: File[]
  
  // Budget & Timeline
  budgetType: 'fixed' | 'hourly'
  budgetMin: string
  budgetMax: string
  currency: string
  timeline: string
  startDate: string
  endDate: string
  isUrgent: boolean
  
  // Milestones (for fixed projects)
  milestones: Array<{
    id: string
    title: string
    description: string
    amount: string
    dueDate: string
    deliverables: string[]
  }>
  
  // Metadata
  visibility: 'public' | 'private' | 'invited_only'
  isDraft: boolean
  currentStep: number
  lastSavedAt: string
}

export const defaultProjectFormData: ProjectFormData = {
  title: '',
  category: '',
  subcategory: '',
  description: '',
  projectType: 'one-time',
  requirements: '',
  skills: [],
  experienceLevel: 'intermediate',
  freelancerType: 'individual',
  location: 'remote',
  attachments: [],
  budgetType: 'fixed',
  budgetMin: '',
  budgetMax: '',
  currency: 'USD',
  timeline: '',
  startDate: '',
  endDate: '',
  isUrgent: false,
  milestones: [], // No default milestones - clients must add them explicitly
  visibility: 'public',
  isDraft: true,
  currentStep: 1,
  lastSavedAt: ''
}

/**
 * Local Storage Service for Project Form Data
 */
export class ProjectFormPersistence {
  private static readonly STORAGE_KEY = 'bizzlink_project_draft'
  
  static save(data: Partial<ProjectFormData>): void {
    try {
      const existingData = this.load()
      const updatedData = {
        ...existingData,
        ...data,
        lastSavedAt: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData))
      console.log('📝 Project draft saved to localStorage')
    } catch (error) {
      console.error('❌ Failed to save project draft:', error)
    }
  }
  
  static load(): ProjectFormData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        console.log('📂 Project draft loaded from localStorage')
        return { ...defaultProjectFormData, ...data }
      }
    } catch (error) {
      console.error('❌ Failed to load project draft:', error)
    }
    return defaultProjectFormData
  }
  
  static clear(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
      console.log('🗑️ Project draft cleared from localStorage')
    } catch (error) {
      console.error('❌ Failed to clear project draft:', error)
    }
  }
  
  static hasData(): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored !== null && stored !== undefined
    } catch {
      return false
    }
  }
}

/**
 * Convert form data to Firebase Project format
 */
export function convertFormDataToProject(
  formData: ProjectFormData, 
  clientId: string,
  clientInfo: { name: string; photoURL: string; verificationStatus: boolean },
  uploadedFiles?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: string;
  }>
): Omit<Project, 'projectId' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'closedAt'> {
  const now = new Date()
  
  // Use provided uploaded files or empty array
  const attachments = uploadedFiles || []
  
  return {
    title: formData.title,
    description: formData.description,
    detailedRequirements: formData.requirements,
    category: formData.category,
    subcategory: formData.subcategory || formData.category,
    clientId,
    clientInfo,
    
    budget: {
      type: formData.budgetType,
      amount: parseFloat(formData.budgetMax) || 0,
      currency: formData.currency,
      minAmount: parseFloat(formData.budgetMin) || 0,
      maxAmount: parseFloat(formData.budgetMax) || 0
    },
    
    timeline: {
      duration: formData.timeline,
      startDate: formData.startDate ? new Date(formData.startDate) as any : now as any,
      endDate: formData.endDate ? new Date(formData.endDate) : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) as any,
      isUrgent: formData.isUrgent
    },
    
    requirements: {
      skills: formData.skills,
      experienceLevel: formData.experienceLevel,
      freelancerType: formData.freelancerType,
      location: formData.location,
      attachments: attachments
    },
    
    status: formData.isDraft ? 'draft' : 'active',
    visibility: formData.visibility,
    proposalCount: 0,
    hiredFreelancerId: '',
    
    milestones: formData.milestones
      .filter(milestone => milestone.title.trim() !== '' || milestone.description.trim() !== '') // Only include milestones with content
      .map((milestone, index) => ({
        id: milestone.id || `milestone-${index + 1}`,
        title: milestone.title,
        description: milestone.description,
        amount: parseFloat(milestone.amount) || 0,
        dueDate: milestone.dueDate ? new Date(milestone.dueDate) as any : now as any,
        status: 'pending' as const,
        deliverables: milestone.deliverables.filter(d => d.trim() !== '')
      }))
  }
}

/**
 * Validation helpers
 */
export function validateStep(step: number, formData: ProjectFormData): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  switch (step) {
    case 1: // Basic Information
      if (!formData.title.trim()) errors.push('Project title is required')
      if (formData.title.length < 10) errors.push('Project title must be at least 10 characters')
      if (!formData.category) errors.push('Please select a category')
      if (!formData.description.trim()) errors.push('Project description is required')
      if (formData.description.length < 100) errors.push('Project description must be at least 100 characters')
      if (!formData.projectType) errors.push('Please select a project type')
      break
      
    case 2: // Requirements
      if (!formData.requirements.trim()) errors.push('Project requirements are required')
      if (formData.requirements.length < 50) errors.push('Please provide more detailed requirements (at least 50 characters)')
      if (formData.skills.length === 0) errors.push('Please select at least one required skill')
      if (formData.skills.length > 20) errors.push('Please select no more than 20 skills')
      if (!formData.experienceLevel) errors.push('Please select required experience level')
      if (!formData.freelancerType) errors.push('Please select freelancer type preference')
      if (!formData.location) errors.push('Please select work location preference')
      
      // Validate file attachments
      if (formData.attachments.length > 5) errors.push('Maximum 5 attachments allowed')
      const oversizedFiles = formData.attachments.filter(file => file.size > 10 * 1024 * 1024)
      if (oversizedFiles.length > 0) errors.push('File size must be less than 10MB')
      break
      
    case 3: // Budget & Timeline
      if (!formData.budgetType) errors.push('Please select a budget type')
      if (!formData.budgetMin || parseFloat(formData.budgetMin) <= 0) errors.push('Please enter a valid minimum budget')
      if (!formData.budgetMax || parseFloat(formData.budgetMax) <= 0) errors.push('Please enter a valid maximum budget')
      if (parseFloat(formData.budgetMin) >= parseFloat(formData.budgetMax)) errors.push('Maximum budget must be greater than minimum budget')
      if (!formData.currency) errors.push('Please select a currency')
      if (!formData.timeline) errors.push('Please select a timeline')
      if (!formData.visibility) errors.push('Please select project visibility')
      
      // Validate dates if provided
      if (formData.startDate && formData.endDate) {
        const startDate = new Date(formData.startDate)
        const endDate = new Date(formData.endDate)
        if (startDate >= endDate) errors.push('End date must be after start date')
      }
      
      // Validate milestones for fixed projects
      if (formData.budgetType === 'fixed' && formData.milestones.length > 0) {
        const validMilestones = formData.milestones.filter(m => m.title.trim() && m.amount.trim())
        if (validMilestones.length > 0) {
          const totalMilestoneAmount = validMilestones.reduce((sum, m) => sum + parseFloat(m.amount), 0)
          const maxBudget = parseFloat(formData.budgetMax)
          if (totalMilestoneAmount > maxBudget) {
            errors.push('Total milestone amount cannot exceed maximum budget')
          }
          
          // Validate milestone dates
          validMilestones.forEach((milestone, index) => {
            if (milestone.dueDate) {
              const milestoneDate = new Date(milestone.dueDate)
              if (formData.startDate && milestoneDate < new Date(formData.startDate)) {
                errors.push(`Milestone ${index + 1} due date cannot be before project start date`)
              }
              if (formData.endDate && milestoneDate > new Date(formData.endDate)) {
                errors.push(`Milestone ${index + 1} due date cannot be after project end date`)
              }
            }
          })
        }
      }
      break
      
    case 4: // Review
      // Final validation - run all previous steps
      const step1Validation = validateStep(1, formData)
      const step2Validation = validateStep(2, formData)
      const step3Validation = validateStep(3, formData)
      
      errors.push(...step1Validation.errors, ...step2Validation.errors, ...step3Validation.errors)
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Auto-save functionality
 */
export class AutoSave {
  private static timeoutId: NodeJS.Timeout | null = null
  private static readonly DEBOUNCE_DELAY = 2000 // 2 seconds
  
  static schedule(data: Partial<ProjectFormData>): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    
    this.timeoutId = setTimeout(() => {
      ProjectFormPersistence.save(data)
    }, this.DEBOUNCE_DELAY)
  }
  
  static cancel(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
  }
}
