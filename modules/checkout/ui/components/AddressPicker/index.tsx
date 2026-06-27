'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import 'leaflet/dist/leaflet.css'
import styles from './AddressPicker.module.css'

export interface AddressResult {
  address_text: string
  latitude: number
  longitude: number
  display_name: string
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  place_id: number
}

interface AddressPickerProps {
  onAddressConfirm?: (address: AddressResult) => void
  onAddressChange?: (address: AddressResult | null) => void
  onAddressSelect?: (address: AddressResult) => void
  defaultLat?: number
  defaultLng?: number
  defaultZoom?: number
  placeholder?: string
  label?: string | null
  confirmLabel?: string
}

let L: typeof import('leaflet') | null = null

export default function AddressPicker({
  onAddressConfirm,
  onAddressChange,
  onAddressSelect,
  defaultLat = 19.136,
  defaultLng = 72.829,
  defaultZoom = 13,
  placeholder = 'Search address...',
  label = 'Delivery Address',
  confirmLabel = 'Confirm Address',
}: AddressPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)
  const markerRef = useRef<import('leaflet').Marker | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState<AddressResult | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // Init Leaflet — runs only after hydration on the client
  useEffect(() => {
    if (mapInstanceRef.current) return

    import('leaflet').then((leaflet) => {
      L = leaflet.default ?? (leaflet as unknown as typeof import('leaflet'))

      // Fix broken marker icons in webpack / Next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (!mapRef.current || mapInstanceRef.current) return

      const map = L.map(mapRef.current, { preferCanvas: true }).setView(
        [defaultLat, defaultLng],
        defaultZoom
      )

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
        placeMarkerOnMap(map, e.latlng.lat, e.latlng.lng, null)
        reverseGeocode(map, e.latlng.lat, e.latlng.lng)
      })

      mapInstanceRef.current = map

      // Force Leaflet to recalculate tile layout after paint
      requestAnimationFrame(() => map.invalidateSize())
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
      markerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeMarkerOnMap = useCallback(
    (map: import('leaflet').Map, lat: number, lng: number, popupLabel: string | null) => {
      if (!L) return
      if (markerRef.current) map.removeLayer(markerRef.current)

      const m = L.marker([lat, lng], { draggable: true }).addTo(map)
      if (popupLabel) m.bindPopup(popupLabel.split(',')[0]).openPopup()

      m.on('dragend', () => {
        const pos = m.getLatLng()
        reverseGeocode(map, pos.lat, pos.lng)
      })

      markerRef.current = m
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const reverseGeocode = useCallback(
    async (map: import('leaflet').Map, lat: number, lng: number) => {
      setStatus('Locating address...')
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
          { headers: { 'Accept-Language': 'en' } }
        )
        const data = await res.json()
        const addr: AddressResult = {
          address_text: data.display_name?.split(',').slice(0, 4).join(',') ?? '',
          latitude: lat,
          longitude: lng,
          display_name: data.display_name ?? '',
        }
        setSelected(addr)
        setQuery(addr.address_text)
        setStatus('Pin updated')
        onAddressChange?.(addr)
      } catch {
        setStatus('Reverse geocode failed')
      }
    },
    [onAddressChange]
  )

  const searchAddress = useCallback(async (q: string) => {
    if (!q || q.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    setStatus('Searching...')
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&countrycodes=in`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data: NominatimResult[] = await res.json()
      setSuggestions(data)
      setShowSuggestions(true)
      setStatus(data.length ? `${data.length} results` : 'No results found')
    } catch {
      setStatus('Search error')
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchAddress(val.trim()), 600)
  }

  const selectSuggestion = (result: NominatimResult) => {
    const map = mapInstanceRef.current
    if (!map) return

    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)
    const shortName = result.display_name.split(',').slice(0, 4).join(', ')

    setQuery(shortName)
    setSuggestions([])
    setShowSuggestions(false)
    map.setView([lat, lng], 16)
    placeMarkerOnMap(map, lat, lng, result.display_name)

    const addr: AddressResult = {
      address_text: shortName,
      latitude: lat,
      longitude: lng,
      display_name: result.display_name,
    }
    setSelected(addr)
    setStatus('Address selected')
    onAddressChange?.(addr)
  }

  const clearAll = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    setSelected(null)
    setStatus('')
    onAddressChange?.(null)
    if (markerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
      markerRef.current = null
    }
  }

  const enableDrag = () => {
    if (markerRef.current) {
      markerRef.current.dragging?.enable()
      setStatus('Drag the pin to adjust location')
    }
  }

  // ✅ NO conditional return — SSR and client always render the same HTML.
  // Leaflet attaches to the map div after hydration via useEffect.
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.layout}>
        <div className={styles.controls}>
          <div className={styles.inputRow}>
            <div className={styles.inputWrap}>
              <input
                type="text"
                className={styles.input}
                placeholder={placeholder}
                value={query}
                onChange={handleInputChange}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                autoComplete="off"
              />

              {showSuggestions && suggestions.length > 0 && (
                <ul className={styles.suggestions}>
                  {suggestions.map((s) => (
                    <li
                      key={s.place_id}
                      className={styles.suggestionItem}
                      onMouseDown={() => selectSuggestion(s)}
                    >
                      <span className={styles.suggestionPin}>📍</span>
                      <span className={styles.suggestionText}>
                        {s.display_name.split(',').slice(0, 4).join(', ')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="button" className={styles.clearBtn} onClick={clearAll}>
              Clear
            </button>
          </div>

          {status && <p className={styles.status}>{status}</p>}

          {selected && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.dot} />
                <span className={styles.cardAddr}>{selected.address_text}</span>
              </div>

              <div className={styles.cardActions}>
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => {
                    if (!selected) return
                    onAddressConfirm?.(selected)
                    onAddressSelect?.(selected)
                  }}
                >
                  {confirmLabel}
                </button>
                <button
                  type="button"
                  className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                  onClick={enableDrag}
                >
                  Adjust Pin
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Always in DOM — Leaflet needs this div to exist at mount time */}
        <div className={styles.mapWrap}>
          <div ref={mapRef} className={styles.map} />
        </div>
      </div>
    </div>
  )
}
