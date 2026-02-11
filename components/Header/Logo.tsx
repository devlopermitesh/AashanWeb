"use client"

import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"

import CLogo from "@/assets/Clogo.png"
import WordLogo from "@/assets/wordLogo.png"

type LogoProps = {
  variant?: "icon" | "full"
  size?: "sm" | "md" | "lg"
  href?: string
  className?: string
}

const sizeStyles = {
  sm: "h-6",
  md: "h-8 sm:h-10",
  lg: "h-14",
}

const Logo = ({
  variant = "full",
  size = "md",
  href = "/",
  className,
}: LogoProps) => {
  const content = (
    <div
      className={clsx(
        "flex items-center gap-2",
        sizeStyles[size],
        className
      )}
    >
      {/* Icon Logo */}
      <Image
        src={CLogo}
        alt="Logo Icon"
        priority
        className="object-contain h-full w-auto"
      />

      {/* Word Logo */}
      {variant === "full" && (
        <Image
          src={WordLogo}
          alt="Logo Text"
          priority
          className="object-contain h-full w-auto"
        />
      )}
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export default Logo
