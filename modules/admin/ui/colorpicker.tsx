'use client'
import { HexColorPicker } from 'react-colorful'
import { useField } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import { useCallback } from 'react'

export function ColorPicker({ path, field }: TextFieldClientProps) {
  const { value: valueFromForm, setValue } = useField<string>({
    potentiallyStalePath: path,
  })

  const value = (valueFromForm ?? '#000000') as string
  const onChange = useCallback(
    (nextValue: string) => {
      // Prevent update loops when the picker emits the same value repeatedly.
      if (nextValue === value) {
        return
      }
      setValue(nextValue)
    },
    [setValue, value]
  )

  return (
    <div className="space-y-3 py-1">
      {field?.label ? (
        <label className="block text-sm font-medium text-foreground">
          {String(field.label)}
          {field.required ? ' *' : ''}
        </label>
      ) : null}
      <HexColorPicker color={value} onChange={onChange} />
    </div>
  )
}
