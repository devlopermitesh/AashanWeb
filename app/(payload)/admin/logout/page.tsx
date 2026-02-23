'use client'
import { useClerk } from '@clerk/nextjs'
import { MinimalTemplate } from '@payloadcms/next/templates'

import { LoadingOverlay, useTranslation } from '@payloadcms/ui'
import { useEffect } from 'react'

const Page = () => {
  const { t } = useTranslation()
  const { signOut } = useClerk()
  useEffect(() => {
    ;(async () => {
      await signOut({ redirectUrl: '/' })
      window.location.href = '/'
    })()
  }, [signOut])
  return (
    <MinimalTemplate>
      <LoadingOverlay animationDuration={'0ms'} loadingText={t('authentication:loggingOut')} />
    </MinimalTemplate>
  )
}
export default Page
