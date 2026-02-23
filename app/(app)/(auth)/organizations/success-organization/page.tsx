'use client'

import { useStepper } from '@/components/providers/StepperForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrganization } from '@clerk/nextjs'
import { CheckCircle2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()
  const { organization } = useOrganization()
  const { currentStep, goToStep } = useStepper()
  useEffect(() => {
    if (!organization) {
      router.replace('/')
      return
    }
    if (currentStep === 4) return
    goToStep(4)
  }, [goToStep, currentStep, organization, router])
  return (
    <Card className="border-2 border-black bg-white py-0 shadow-[8px_8px_0_0_#000]">
      <CardHeader className="border-b-2 border-black px-5 py-4">
        <Badge className="mb-2 border-2 border-black bg-lime-300 text-[10px] font-extrabold uppercase text-black">
          Completed
        </Badge>
        <CardTitle className="text-2xl font-black uppercase tracking-wide text-black">
          Organization ready
        </CardTitle>
        <CardDescription className="font-medium text-black/75">
          Your workspace is created and ready for management.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-6">
        <div className="flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center border-2 border-black bg-lime-200 shadow-[4px_4px_0_0_#000]">
            <CheckCircle2 className="h-12 w-12 text-black" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-black uppercase text-black sm:text-2xl">
            Organization Created Successfully
          </h1>
          <p className="text-sm font-medium text-black/75 sm:text-base">
            Continue to your admin dashboard and start managing your workspace.
          </p>
        </div>
        <Button
          onClick={() => router.push('/admin')}
          className="w-full text-sm font-bold uppercase sm:h-11"
        >
          Go to Admin Dashboard
        </Button>
      </CardContent>
    </Card>
  )
}

export default Page
