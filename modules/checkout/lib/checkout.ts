import { z } from 'zod'

export const CHECKOUT_SHIPPING_PRICE = 79
export const CHECKOUT_FREE_SHIPPING_THRESHOLD = 1499

export const checkoutFormSchema = z
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
    latitude: z.number().finite().min(-90).max(90),
    longitude: z.number().finite().min(-180).max(180),
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

export const checkoutInputSchema = z.object({
  orders: z
    .array(
      z.object({
        shopId: z.string().trim().min(1, 'Shop ID is required.'),
        items: z
          .array(
            z.object({
              productId: z.string().trim().min(1, 'Product ID is required.'),
              variantId: z.string().trim().optional(),
              quantity: z.number().int().min(1, 'Quantity must be at least 1.'),
            })
          )
          .min(1, 'Each shop order needs at least one item.'),
      })
    )
    .min(1, 'Your cart is empty.'),
  userInfo: checkoutFormSchema,
})

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>
export type CheckoutInput = z.infer<typeof checkoutInputSchema>
