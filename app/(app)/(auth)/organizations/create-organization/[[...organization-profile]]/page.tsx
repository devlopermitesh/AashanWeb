'use client'
import { useStepper } from '@/components/providers/StepperForm'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateOrganization, useOrganization } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const { currentStep, goToStep } = useStepper()
  const { organization } = useOrganization()
  const router = useRouter()

  useEffect(() => {
    if (organization) {
      router.replace('/organizations/success-organization')
      return
    }
    if (currentStep === 3) return
    goToStep(3)
  }, [currentStep, goToStep, organization, router])

  return (
    <Card className="border-2 border-black bg-white py-0 shadow-[8px_8px_0_0_#000]">
      <CardHeader className="border-b-2 border-black px-5 py-4">
        <Badge className="mb-2 border-2 border-black bg-orange-300 text-[10px] font-extrabold uppercase text-black">
          Organization
        </Badge>
        <CardTitle className="text-2xl font-black uppercase tracking-wide text-black">
          Set up organization
        </CardTitle>
        <CardDescription className="font-medium text-black/75">
          Add your organization details to finish onboarding.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-4 sm:px-5">
        <div className="[&_.cl-card]:w-full [&_.cl-card]:border-0 [&_.cl-card]:bg-transparent [&_.cl-card]:shadow-none [&_.cl-formButtonPrimary]:border-2 [&_.cl-formButtonPrimary]:border-black [&_.cl-formButtonPrimary]:shadow-[3px_3px_0_0_#000] [&_.cl-formFieldInput]:rounded-base [&_.cl-formFieldInput]:border-2 [&_.cl-formFieldInput]:border-black [&_.cl-formFieldInput]:shadow-[2px_2px_0_0_#000]">
          <CreateOrganization afterCreateOrganizationUrl="/organizations/success-organization" />
        </div>
      </CardContent>
    </Card>
  )
}
export default Page
