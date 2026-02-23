'use client'
import { useStepper } from '@/components/providers/StepperForm'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignUp, useSignUp } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const { isLoaded, signUp } = useSignUp()
  const pathname = usePathname()
  const { currentStep, goToNext, markStepComplete, steps, goToStep } = useStepper()
  const isVerifyEmailStep =
    typeof window !== 'undefined' && window.location.hash.includes('verify-email-address')

  const isChooseOrgStep =
    typeof window !== 'undefined' && window.location.hash.includes('choose-organization')

  useEffect(() => {
    if (!isLoaded) return

    if (isVerifyEmailStep) {
      return goToStep(2)
    }
    if (isChooseOrgStep) {
      return goToStep(3)
    }
    // Clerk sets status to 'complete' once email is verified
    if (signUp.status === 'complete') {
      markStepComplete('sign-up')
    }
  }, [
    currentStep,
    goToNext,
    isLoaded,
    markStepComplete,
    signUp?.status,
    signUp?.unverifiedFields,
    steps,
    pathname,
  ])

  return (
    <Card className="border-2 border-black bg-white py-0 shadow-[8px_8px_0_0_#000]">
      <CardHeader className="border-b-2 border-black px-5 py-4">
        <Badge className="mb-2 border-2 border-black bg-cyan-300 text-[10px] font-extrabold uppercase text-black">
          Organization
        </Badge>
        <CardTitle className="text-2xl font-black uppercase tracking-wide text-black">
          Create your account
        </CardTitle>
        <CardDescription className="font-medium text-black/75">
          Sign up first, then continue to set up your organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-4 sm:px-5">
        <div className="[&_.cl-card]:w-full [&_.cl-card]:border-0 [&_.cl-card]:bg-transparent [&_.cl-card]:shadow-none [&_.cl-footerActionLink]:font-bold [&_.cl-formButtonPrimary]:border-2 [&_.cl-formButtonPrimary]:border-black [&_.cl-formButtonPrimary]:shadow-[3px_3px_0_0_#000] [&_.cl-formFieldInput]:rounded-base [&_.cl-formFieldInput]:border-2 [&_.cl-formFieldInput]:border-black [&_.cl-formFieldInput]:shadow-[2px_2px_0_0_#000]">
          <SignUp forceRedirectUrl="/organizations/create-organization" routing="hash" />
        </div>
      </CardContent>
    </Card>
  )
}
export default Page
