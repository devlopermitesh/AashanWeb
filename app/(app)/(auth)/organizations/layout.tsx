'use client'
import StepperFormLayout from '@/modules/auth/ui/view/StepperLayout'
import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen overflow-hidden bg-[linear-gradient(145deg,#fde047_0%,#fca5a5_45%,#93c5fd_100%)] lg:pr-[min(42vw,560px)]">
      <div className="relative z-10 h-full overflow-y-auto">
        <StepperFormLayout>{children}</StepperFormLayout>
      </div>

      <aside className="fixed right-0 top-0 hidden h-screen w-[min(42vw,560px)] overflow-hidden border-l-2 border-black bg-[#fef7d7] lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#ffffff_0%,transparent_45%),radial-gradient(circle_at_80%_70%,#bef264_0%,transparent_40%)] opacity-70" />
        <div className="relative flex h-full flex-col gap-10 p-8 xl:p-10">
          <div className="space-y-4 border-2 border-black bg-white p-5 shadow-[8px_8px_0_0_#000]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/70">
              Aashan Flow
            </p>
            <h2 className="text-3xl font-black uppercase leading-tight text-black">
              Build your org
            </h2>
            <p className="text-sm font-medium text-black/75">
              Complete each step and launch your team workspace with a clean setup.
            </p>
          </div>

          <div className="relative overflow-hidden border-2 border-black bg-cyan-200 shadow-[8px_8px_0_0_#000]">
            <div
              className="h-[52vh] min-h-[320px] w-full bg-cover bg-right"
              style={{
                backgroundImage: "url('/signformplaceholder.png')",
              }}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}
export default Layout
