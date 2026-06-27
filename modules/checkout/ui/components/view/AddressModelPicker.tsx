import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'
import AddressPicker, { type AddressResult } from '../AddressPicker'

type AddressModalPickerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  className?: string
  value?: AddressResult | null
  onConfirm: (address: AddressResult) => void
}

const AddressModalPicker = ({
  open,
  onOpenChange,
  className,
  value,
  onConfirm,
}: AddressModalPickerProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'max-w-6xl overflow-hidden rounded-none border-4 border-black bg-[#fffdf7] p-0 shadow-[10px_10px_0_0_#000]',
          'h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[80vh]',
          className
        )}
      >
        <div className="flex h-full flex-col">
          <DialogHeader className="border-b-4 border-black bg-[#ffe58f] px-5 py-4 text-left">
            <DialogTitle className="text-xl font-black tracking-tight text-black sm:text-2xl">
              Choose your delivery pin
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm font-bold text-black/80">
              Search your area, then fine-tune by dropping the pin on the map. Confirm once the pin
              matches your entrance / gate.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto p-5">
            <AddressPicker
              label={null}
              placeholder="Search area / landmark..."
              defaultLat={value?.latitude}
              defaultLng={value?.longitude}
              defaultZoom={value ? 16 : 13}
              confirmLabel="Use this location"
              onAddressConfirm={(address) => {
                onConfirm(address)
                onOpenChange(false)
              }}
            />
          </div>

          <div className="border-t-4 border-black bg-white px-5 py-3 text-xs font-bold text-black/70">
            Tip: If the address looks off, use “Adjust Pin” and drag the marker.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
export default AddressModalPicker
