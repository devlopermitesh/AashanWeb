'use client'

import { createContext, useContext, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export type StepId = 'sign-up' | 'verify-email' | 'create-org' | 'complete'

export interface Step {
  id: StepId
  label: string
  description: string
  isCompleted: boolean
  isSkippable: boolean
}

const DEFAULT_STEPS: Step[] = [
  {
    id: 'sign-up',
    label: 'Create Account',
    description: 'Set up your credentials',
    isCompleted: false,
    isSkippable: false,
  },
  {
    id: 'verify-email',
    label: 'Verify Email',
    description: 'Confirm your email address',
    isCompleted: false,
    isSkippable: false,
  },
  {
    id: 'create-org',
    label: 'Create Organisation',
    description: 'Set up your workspace',
    isCompleted: false,
    isSkippable: false,
  },
  {
    id: 'complete',
    label: 'All Done',
    description: "You're ready to go",
    isCompleted: false,
    isSkippable: false,
  },
]

interface StepperState {
  steps: Step[]
  currentStep: number
  currentStepId: StepId
  totalSteps: number
  goToNext: () => void
  goToPrev: () => void
  goToStep: (step: number) => void
  markStepComplete: (id: StepId) => void
}

const StepperContext = createContext<StepperState | null>(null)

export const StepperFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState<Step[]>(DEFAULT_STEPS)
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname.startsWith('/organizations')) return

    let nextStep = 1

    if (pathname.includes('/organizations/success-organization')) {
      nextStep = 4
    } else if (pathname.includes('/organizations/create-organization')) {
      nextStep = 3
    } else if (pathname.includes('/organizations/sign-up')) {
      nextStep = 1
    }

    setCurrentStep((prev) => (prev === nextStep ? prev : nextStep))
  }, [pathname])

  const markStepComplete = (id: StepId) =>
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, isCompleted: true } : s)))

  const value: StepperState = {
    steps,
    currentStep,
    currentStepId: steps[currentStep - 1].id,
    totalSteps: steps.length,
    goToNext: () => setCurrentStep((p) => Math.min(p + 1, steps.length)),
    goToPrev: () => setCurrentStep((p) => Math.max(p - 1, 1)),
    goToStep: (s) => setCurrentStep(Math.max(1, Math.min(s, steps.length))),
    markStepComplete,
  }

  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
}

export const useStepper = () => {
  const ctx = useContext(StepperContext)
  if (!ctx) throw new Error('useStepper must be used inside <StepperFormProvider>')
  return ctx
}
