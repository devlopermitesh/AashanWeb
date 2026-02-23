'use client'

import Logo from '@/components/Header/Logo'
import { StepperFormProvider, useStepper } from '@/components/providers/StepperForm'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator = () => {
  const { steps, currentStep, totalSteps } = useStepper()
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100

  return (
    <div className="w-full space-y-6">
      {/* Progress bar */}
      <div className="space-y-3 rounded-xl border-2 border-black bg-yellow-100 p-3 shadow-[4px_4px_0_0_#000]">
        <div className="flex items-center justify-between text-sm font-semibold text-black">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <Badge className="rounded-md border-2 border-black bg-black px-2 py-1 text-xs font-bold text-white">
            {Math.round(progress)}% complete
          </Badge>
        </div>
        <Progress value={progress} className="h-3 rounded-none border-2 border-black bg-white" />
      </div>

      {/* Steps — horizontal on md+, vertical on mobile */}
      <div className="relative hidden items-start justify-between md:flex">
        {/* connector line */}
        <div className="absolute left-0 right-0 top-4 z-0 mx-8 h-1 border-y border-black bg-black/20" />

        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isDone = step.isCompleted

          return (
            <div key={step.id} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              {/* Circle */}
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center border-2 border-black bg-white text-black transition-all duration-300',
                  isDone && 'bg-lime-300 shadow-[3px_3px_0_0_#000]',
                  isActive && !isDone && 'bg-cyan-300 shadow-[3px_3px_0_0_#000] -translate-y-0.5',
                  !isActive && !isDone && 'bg-zinc-100 opacity-75'
                )}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-extrabold">{stepNumber}</span>
                )}
              </div>

              {/* Label + description */}
              <div className="max-w-[100px] text-center">
                <p
                  className={cn(
                    'text-xs font-extrabold uppercase leading-tight tracking-wide',
                    isActive ? 'text-black' : 'text-black/70'
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 hidden text-[10px] font-semibold leading-tight text-black/70 lg:block">
                  {step.description}
                </p>
              </div>

              {/* Active badge */}
              {isActive && (
                <Badge className="h-5 rounded-md border-2 border-black bg-orange-300 px-1.5 py-0 text-[10px] font-extrabold uppercase text-black">
                  Current
                </Badge>
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: vertical compact list */}
      <div className="flex flex-col gap-3 md:hidden">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isDone = step.isCompleted

          return (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-3 border-2 border-black p-3 transition-all',
                isActive && 'bg-cyan-200 shadow-[4px_4px_0_0_#000]',
                isDone && 'bg-lime-200 shadow-[4px_4px_0_0_#000]',
                !isActive && !isDone && 'bg-white'
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-white',
                  isDone && 'bg-lime-300',
                  isActive && !isDone && 'bg-cyan-300',
                  !isActive && !isDone && 'bg-zinc-100'
                )}
              >
                {isDone ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <span className="text-xs font-extrabold">{stepNumber}</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-extrabold uppercase tracking-wide">
                  {step.label}
                </p>
                <p className="truncate text-xs font-medium text-black/70">{step.description}</p>
              </div>

              {isActive && (
                <Badge className="shrink-0 rounded-md border-2 border-black bg-orange-300 text-[10px] font-extrabold uppercase text-black">
                  Now
                </Badge>
              )}
              {isDone && (
                <Badge className="shrink-0 rounded-md border-2 border-black bg-lime-300 text-[10px] font-extrabold uppercase text-black">
                  Done
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Active Step Title ────────────────────────────────────────────────────────

const ActiveStepHeader = () => {
  const { steps, currentStep } = useStepper()
  const active = steps[currentStep - 1]

  return (
    <div className="space-y-2 rounded-xl border-2 border-black bg-pink-100 p-4 shadow-[4px_4px_0_0_#000]">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-black uppercase tracking-wide text-black">{active.label}</h2>
        <Badge className="rounded-md border-2 border-black bg-white text-xs font-extrabold text-black">
          {currentStep}/{steps.length}
        </Badge>
      </div>
      <p className="text-sm font-medium text-black/75">{active.description}</p>
    </div>
  )
}

// ─── Layout ───────────────────────────────────────────────────────────────────

const StepperLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-start justify-center bg-[linear-gradient(135deg,#fde047_0%,#fca5a5_45%,#93c5fd_100%)] sm:p-4 pt-8 md:pt-16">
      <div className="w-full max-w-lg space-y-8">
        {/* Brand / logo area */}
        <div className="space-y-2 border-2 border-black bg-white p-4 text-center shadow-[6px_6px_0_0_#000]">
          <div className="mb-2 inline-flex h-12 w-12 items-center justify-center border-2 border-black bg-yellow-300 text-lg font-black text-black shadow-[3px_3px_0_0_#000]">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-wide text-black">Get started</h1>
          <p className="text-sm font-medium text-black/75">
            Complete the steps below to set up your account
          </p>
        </div>

        {/* Stepper indicator */}
        <StepIndicator />

        {/* Card wrapping the active step */}
        <div className="border-2 border-black bg-white shadow-[8px_8px_0_0_#000]">
          <div className="border-b-2 border-black p-5">
            <ActiveStepHeader />
          </div>
          <div className="sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

// ─── Root export ──────────────────────────────────────────────────────────────

export const StepperFormLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StepperFormProvider>
      <StepperLayout>{children}</StepperLayout>
    </StepperFormProvider>
  )
}

export default StepperFormLayout
