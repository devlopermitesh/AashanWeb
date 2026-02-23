'use client'
import { SignUp } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const Page = () => {
  return (
    <Card className="border-2 border-black bg-white py-0 shadow-[8px_8px_0_0_#000]">
      <CardHeader className="border-b-2 border-black px-5 py-4">
        <Badge className="mb-2 border-2 border-black bg-cyan-300 text-[10px] font-extrabold uppercase text-black">
          Sign Up
        </Badge>
        <CardTitle className="text-2xl font-black uppercase tracking-wide text-black">
          Create your account
        </CardTitle>
        <CardDescription className="font-medium text-black/70">
          Start onboarding and set up your workspace in minutes.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 py-4 sm:px-5">
        <div className="[&_.cl-card]:shadow-none [&_.cl-card]:border-0 [&_.cl-card]:bg-transparent [&_.cl-footerActionLink]:font-bold [&_.cl-formButtonPrimary]:border-2 [&_.cl-formButtonPrimary]:border-black [&_.cl-formButtonPrimary]:shadow-[3px_3px_0_0_#000] [&_.cl-formFieldInput]:border-2 [&_.cl-formFieldInput]:border-black [&_.cl-formFieldInput]:rounded-base [&_.cl-formFieldInput]:shadow-[2px_2px_0_0_#000]">
          <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
      </CardContent>
    </Card>
  )
}
export default Page
