import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

import { checkoutTextareaClass } from './checkout-styles'

type CheckoutTextareaFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  placeholder: string
  description?: string
  disabled?: boolean
  rows?: number
  className?: string
}

const CheckoutTextareaField = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  disabled,
  rows = 5,
  className,
}: CheckoutTextareaFieldProps<TFieldValues>) => {
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
            <textarea
              {...field}
              value={typeof field.value === 'string' ? field.value : ''}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className={cn(
                checkoutTextareaClass,
                'w-full resize-none',
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

export default CheckoutTextareaField
