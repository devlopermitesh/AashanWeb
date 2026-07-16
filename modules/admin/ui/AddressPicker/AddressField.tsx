'use client'

import { AddressPicker, type AddressResult } from '@/modules/admin/ui/AddressPicker'
import { useField } from '@payloadcms/ui'
import type { ArrayFieldClientProps } from 'payload'
import { useCallback, useMemo } from 'react'

type CoordRow = number | { id?: string; value?: number | null } | null

function parseCoordinates(value: unknown): {
  lng?: number
  lat?: number
  row0Id?: string
  row1Id?: string
} {
  if (!Array.isArray(value) || value.length < 2) {
    return {}
  }

  const row0 = value[0] as CoordRow
  const row1 = value[1] as CoordRow
  const row0Id =
    row0 && typeof row0 === 'object' && 'id' in row0 && typeof row0.id === 'string'
      ? row0.id
      : undefined
  const row1Id =
    row1 && typeof row1 === 'object' && 'id' in row1 && typeof row1.id === 'string'
      ? row1.id
      : undefined

  const lng =
    typeof row0 === 'number'
      ? row0
      : row0 && typeof row0 === 'object' && typeof row0.value === 'number'
        ? row0.value
        : undefined
  const lat =
    typeof row1 === 'number'
      ? row1
      : row1 && typeof row1 === 'object' && typeof row1.value === 'number'
        ? row1.value
        : undefined

  if (
    typeof lng !== 'number' ||
    !Number.isFinite(lng) ||
    typeof lat !== 'number' ||
    !Number.isFinite(lat)
  ) {
    return { row0Id, row1Id }
  }
  return { lng, lat, row0Id, row1Id }
}

export function AddressField({ path, field }: ArrayFieldClientProps) {
  const { value: valueFromForm, setValue } = useField<unknown>({
    potentiallyStalePath: path,
  })
  const addressPath =
    (field?.admin as { custom?: { addressPath?: string } } | undefined)?.custom?.addressPath ??
    'address'
  const { value: addressValue, setValue: setAddressValue } = useField<string>({
    potentiallyStalePath: addressPath,
  })

  const { lng, lat, row0Id, row1Id } = useMemo(
    () => parseCoordinates(valueFromForm),
    [valueFromForm]
  )

  const setCoordinates = useCallback(
    (nextLng: number, nextLat: number) => {
      if (!Number.isFinite(nextLng) || !Number.isFinite(nextLat)) return
      if (lng === nextLng && lat === nextLat) return

      const nextValue: Array<{ id?: string; value: number }> = [
        row0Id ? { id: row0Id, value: nextLng } : { value: nextLng },
        row1Id ? { id: row1Id, value: nextLat } : { value: nextLat },
      ]
      setValue(nextValue)
    },
    [lat, lng, row0Id, row1Id, setValue]
  )

  const handleAddressChange = useCallback(
    (address: AddressResult | null) => {
      if (!address) {
        setValue([])
        return
      }
      setCoordinates(address.longitude, address.latitude)
    },
    [setCoordinates, setValue]
  )

  const handleAddressConfirm = useCallback(
    (address: AddressResult) => {
      setCoordinates(address.longitude, address.latitude)
      const nextAddressText = (address.display_name || address.address_text || '').trim()
      if (nextAddressText) {
        setAddressValue(nextAddressText)
      }
    },
    [setAddressValue, setCoordinates]
  )

  const hasExistingCoords = typeof lng === 'number' && typeof lat === 'number'

  return (
    <div className="space-y-2 py-1">
      <AddressPicker
        label={field?.label ? String(field.label) : null}
        placeholder="Search address / landmark..."
        confirmLabel="Save location"
        initialQuery={typeof addressValue === 'string' ? addressValue : ''}
        defaultLat={lat}
        defaultLng={lng}
        defaultZoom={hasExistingCoords ? 16 : 13}
        initialMarker={hasExistingCoords}
        reverseGeocodeOnLoad={hasExistingCoords && !addressValue}
        onAddressChange={handleAddressChange}
        onAddressConfirm={handleAddressConfirm}
      />

      <div className="text-xs text-muted-foreground">
        Coordinates: [{typeof lng === 'number' ? lng : '—'}, {typeof lat === 'number' ? lat : '—'}]
      </div>
    </div>
  )
}
