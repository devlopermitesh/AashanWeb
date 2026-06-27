import type { ComponentProps } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

import { checkoutInputClass } from './checkout-styles'

type CheckoutFormFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder: string
  description?: string
  type?: ComponentProps<'input'>['type']
  disabled?: boolean
  inputMode?: ComponentProps<'input'>['inputMode']
  autoComplete?: ComponentProps<'input'>['autoComplete']
  className?: string
}

const CheckoutFormField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  type = 'text',
  disabled,
  inputMode,
  autoComplete,
  className,
}: CheckoutFormFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-sm font-black uppercase tracking-[0.08em] text-black">
            {label}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              value={typeof field.value === 'string' ? field.value : ''}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              inputMode={inputMode}
              autoComplete={autoComplete}
              className={cn(
                checkoutInputClass,
                disabled && 'cursor-not-allowed bg-[#f3f4f6] text-[#6b7280]'
              )}
            />
          </FormControl>
          {description ? (
            <FormDescription className="text-xs font-bold leading-5 text-[#4b5563]">
              {description}
            </FormDescription>
          ) : null}
          <FormMessage className="font-bold text-[#c2410c]" />
        </FormItem>
      )}
    />
  )
}

export default CheckoutFormField
