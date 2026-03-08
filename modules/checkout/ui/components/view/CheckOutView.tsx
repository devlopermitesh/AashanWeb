'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueries } from '@tanstack/react-query'
import { CreditCard, MapPinned, PackageCheck, Sparkles } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useTRPC } from '@/components/providers/TrcpProvider'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import useCart from '@/modules/checkout/store/use-cart'
import type { CartItem } from '@/modules/checkout/store/use-cart'
import CheckoutFormField from '@/modules/checkout/ui/components/CheckoutFormField'
import CheckoutOrderSummary, {
  type CheckoutSummaryProduct,
  type CheckoutSummarySection,
} from '@/modules/checkout/ui/components/CheckoutOrderSummary'
import CheckoutSectionCard from '@/modules/checkout/ui/components/CheckoutSectionCard'
import CheckoutTextareaField from '@/modules/checkout/ui/components/CheckoutTextareaField'
import {
  checkoutActionClass,
  checkoutCardClass,
  checkoutPanelClass,
  checkoutPillClass,
} from '@/modules/checkout/ui/components/checkout-styles'
import { currencyFormatter } from '@/utils/currencyFormat'
const SHEEPING_PRICE = 79
const checkoutSchema = z
  .object({
    firstName: z.string().trim().min(2, 'Enter at least 2 characters.'),
    lastName: z.string().trim().min(1, 'Last name is required.'),
    mobileNumber: z
      .string()
      .trim()
      .regex(/^\d{10}$/, 'Use a valid 10 digit mobile number.'),
    customerAddress: z.string().trim().min(10, 'Add a fuller pickup or billing address.'),
    deliverySameAsCustomer: z.boolean(),
    deliveryAddress: z.string().trim(),
    instructions: z.string().trim().max(300, 'Keep instructions under 300 characters.'),
  })
  .superRefine((values, ctx) => {
    if (!values.deliverySameAsCustomer && values.deliveryAddress.length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['deliveryAddress'],
        message: 'Add a fuller delivery address.',
      })
    }
  })

type CheckoutFormValues = z.infer<typeof checkoutSchema>

type CheckoutCartEntry = {
  item: CartItem
}

const getShopFallbackLabel = (shopId: string, index: number) => {
  const compactId = shopId.trim().slice(0, 8)

  return compactId ? `Shop ${compactId}` : `Shop ${index + 1}`
}

const resolveShopSections = (
  shopCart: ReturnType<typeof useCart.getState>['shopCart'],
  productQueries: Array<{
    data?: CheckoutSummaryProduct | null
    isLoading: boolean
    isError: boolean
  }>
): CheckoutSummarySection[] => {
  let queryIndex = 0

  return shopCart.map((shop, sectionIndex) => {
    const items = shop.items.map((cartItem) => {
      const query = productQueries[queryIndex++]
      const product = query?.data ?? null
      const selectedVariant =
        cartItem.variantId && Array.isArray(product?.mediaVariants)
          ? product.mediaVariants.find((variant) => variant?.id === cartItem.variantId)
          : null

      return {
        ...cartItem,
        isLoading: query?.isLoading ?? false,
        isError: query?.isError ?? false,
        product,
        variantLabel: selectedVariant?.colorName?.trim() || null,
      }
    })

    const resolvedShopName =
      items.find((item) => item.product?.tenant?.name)?.product?.tenant?.name ??
      getShopFallbackLabel(shop.shopId, sectionIndex)

    return {
      shopId: shop.shopId,
      shopName: resolvedShopName,
      items,
    }
  })
}

const CheckOutView = () => {
  const trpc = useTRPC()
  const { shopCart, removeProduct, getItemCount } = useCart()
  const [submissionNote, setSubmissionNote] = useState<string | null>(null)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      mobileNumber: '',
      customerAddress: '',
      deliverySameAsCustomer: true,
      deliveryAddress: '',
      instructions: '',
    },
  })

  const sameAsCustomer = form.watch('deliverySameAsCustomer')
  const customerAddress = form.watch('customerAddress')

  useEffect(() => {
    if (!sameAsCustomer) {
      return
    }

    form.setValue('deliveryAddress', customerAddress, {
      shouldDirty: customerAddress.length > 0,
      shouldTouch: false,
      shouldValidate: true,
    })
  }, [customerAddress, form, sameAsCustomer])

  const cartEntries: CheckoutCartEntry[] = shopCart.flatMap((shop) =>
    shop.items.map((item) => ({ item }))
  )

  const productQueries = useQueries({
    queries: cartEntries.map(({ item }) =>
      trpc.product.getOne.queryOptions({ slug: item.productId })
    ),
  })

  const shopSections = resolveShopSections(shopCart, productQueries)
  const totalItems = getItemCount()
  const subtotal = shopSections.reduce(
    (sum, section) =>
      sum +
      section.items.reduce(
        (sectionSum, item) => sectionSum + (item.product?.price ?? 0) * item.quantity,
        0
      ),
    0
  )
  const shippingFee = totalItems === 0 ? 0 : subtotal >= 1499 ? 0 : SHEEPING_PRICE
  const grandTotal = subtotal + shippingFee
  const hasPendingProducts = productQueries.some((query) => query.isLoading)

  const handleSubmit = (values: CheckoutFormValues) => {
    setSubmissionNote(
      `Validated for ${values.firstName} ${values.lastName}. Payment handoff is the next integration step.`
    )
  }

  return (
    <section className="relative min-h-full w-full overflow-hidden bg-[linear-gradient(180deg,_#fff7e8_0%,_#fffdf7_38%,_#dff2ff_100%)]">
      <div className="absolute inset-x-0 top-0 h-52 bg-[radial-gradient(circle_at_top_left,_rgba(255,229,143,0.65),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(217,240,255,0.9),_transparent_45%)]" />
      <div className="absolute left-6 top-24 h-24 w-24 rounded-full border-2 border-black/10 bg-[#ffe58f]/40 blur-2xl" />
      <div className="absolute right-8 top-44 h-28 w-28 rounded-full border-2 border-black/10 bg-[#dff2ff]/60 blur-2xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_390px]"
          >
            <div className="space-y-6">
              <section className={cn(checkoutCardClass, 'overflow-hidden bg-[#fff4d6]')}>
                <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div>
                    <div className="flex flex-wrap gap-3">
                      <span className={cn(checkoutPillClass, 'bg-white text-black')}>
                        <Sparkles size={14} />
                        Checkout flow
                      </span>
                      <span className={cn(checkoutPillClass, 'bg-[#e9f7db] text-black')}>
                        <PackageCheck size={14} />
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    <h1 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-black sm:text-4xl">
                      Clean, fast checkout without losing the cart context.
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-[#4b5563] sm:text-base">
                      Finish the required delivery details on the left, keep the live order summary
                      on the right, and stay mobile-friendly all the way down.
                    </p>
                  </div>

                  <div className={cn(checkoutPanelClass, 'bg-white p-4 sm:w-[260px]')}>
                    <p className="text-xs font-black uppercase tracking-[0.08em] text-[#4b5563]">
                      Current total
                    </p>
                    <p className="mt-2 text-3xl font-black text-black">
                      {currencyFormatter.format(grandTotal)}
                    </p>
                    <p className="mt-2 text-xs font-bold leading-5 text-[#4b5563]">
                      Includes shipping logic and live cart updates from persisted state.
                    </p>
                  </div>
                </div>
              </section>

              <CheckoutSectionCard
                eyebrow="Step 1"
                title="Customer details"
                description="Collect the basics first so delivery and contact confirmation stay straightforward."
                icon={<CreditCard size={22} className="text-black" />}
                iconToneClassName="bg-[#dff2ff]"
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <CheckoutFormField
                    control={form.control}
                    name="firstName"
                    label="First name"
                    placeholder="Aashan"
                    autoComplete="given-name"
                  />
                  <CheckoutFormField
                    control={form.control}
                    name="lastName"
                    label="Last name"
                    placeholder="Customer"
                    autoComplete="family-name"
                  />
                  <CheckoutFormField
                    control={form.control}
                    name="mobileNumber"
                    label="Mobile number"
                    placeholder="9876543210"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    description="Use the active number for delivery calls and payment confirmations."
                    className="md:col-span-2"
                  />
                </div>
              </CheckoutSectionCard>

              <CheckoutSectionCard
                eyebrow="Step 2"
                title="Address details"
                description="Use the fields from your checkout brief and make the delivery toggle easy to understand on every screen size."
                icon={<MapPinned size={22} className="text-black" />}
                iconToneClassName="bg-[#e9f7db]"
              >
                <div className="space-y-5">
                  <CheckoutTextareaField
                    control={form.control}
                    name="customerAddress"
                    label="Customer address"
                    placeholder="House / flat, street, landmark, area, city, state"
                    description="This can work as your billing or primary contact address."
                  />

                  <FormField
                    control={form.control}
                    name="deliverySameAsCustomer"
                    render={({ field }) => (
                      <FormItem className={cn(checkoutPanelClass, 'bg-[#f8fafc] p-4')}>
                        <div className="flex items-start gap-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(Boolean(checked))}
                              className="mt-1 h-5 w-5 rounded-[6px] border-2 border-black outline-none data-[state=checked]:bg-black data-[state=checked]:text-white"
                            />
                          </FormControl>
                          <div className="space-y-1">
                            <FormLabel className="text-sm font-black uppercase tracking-[0.08em] text-black">
                              Delivery address is same as customer address
                            </FormLabel>
                            <FormDescription className="text-xs font-bold leading-5 text-[#4b5563]">
                              Keep this on to mirror the first address field and reduce friction on
                              mobile checkout.
                            </FormDescription>
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />

                  <CheckoutTextareaField
                    control={form.control}
                    name="deliveryAddress"
                    label="Delivery address"
                    placeholder="If different, enter the delivery location here"
                    disabled={sameAsCustomer}
                    description={
                      sameAsCustomer
                        ? 'This field mirrors the customer address while the toggle is enabled.'
                        : 'Use a more precise drop point, gate number, or receiver address if needed.'
                    }
                  />

                  <CheckoutTextareaField
                    control={form.control}
                    name="instructions"
                    label="Instructions"
                    placeholder="Optional notes for delivery partner, access gate, or preferred timing"
                    description="Optional. Keep it brief and only include delivery-specific context."
                    rows={4}
                  />
                </div>
              </CheckoutSectionCard>
            </div>

            <CheckoutOrderSummary
              shopSections={shopSections}
              totalItems={totalItems}
              subtotal={subtotal}
              shippingFee={shippingFee}
              grandTotal={grandTotal}
              hasPendingProducts={hasPendingProducts}
              onRemoveItem={removeProduct}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </div>
    </section>
  )
}

export default CheckOutView
