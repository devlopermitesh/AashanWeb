import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'

export const CustomeClerkProvider = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider>{children}</ClerkProvider>
}
