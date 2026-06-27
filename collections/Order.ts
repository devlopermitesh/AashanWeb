import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: [
      'orderNumber',
      'customer',
      'totalAmount',
      'paymentStatus',
      'fulfillmentStatus',
    ],
  },
  fields: [
    // ===== Order Identifiers =====
    {
      name: 'orderNumber',
      type: 'number',
      unique: true,
      admin: { description: 'Auto-incremented unique order number' },
    },

    // ===== Customer & Assignment =====
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { description: 'Customer who placed the order' },
    },
    {
      name: 'customerName',
      type: 'text',
      admin: { description: 'Customer full name captured at checkout' },
    },
    {
      name: 'customerPhone',
      type: 'text',
      admin: { description: 'Customer phone number captured at checkout' },
    },
    {
      name: 'billingAddress',
      type: 'textarea',
      admin: { description: 'Customer billing/contact address from checkout' },
    },
    {
      name: 'deliveryPartner',
      type: 'relationship',
      relationTo: 'delivery-partners',
      required: false,
      hasMany: false,
      admin: {
        description: 'Assign a delivery partner (optional initially)',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value === '') return null
            return value
          },
        ],
      },
    },
    {
      name: 'deliveryBranch',
      type: 'relationship',
      relationTo: 'branch',
      required: false,
      hasMany: false,
      admin: {
        description: 'Assign a delivery branch responsible for this order',
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (value === '') return null
            return value
          },
        ],
      },
    },

    // ===== Order Items =====
    {
      name: 'items',
      type: 'array',
      admin: { description: 'Products included in this order' },
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', required: true },
        { name: 'quantity', type: 'number', required: true, min: 1 },
        { name: 'variantId', type: 'text', admin: { description: 'Variant ID if applicable' } },
        {
          name: 'amount',
          type: 'number',
          required: true,
          admin: { description: 'Amount for this item' },
        },
      ],
    },

    // ===== Financials =====
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
      admin: { description: 'Total order amount in smallest currency unit' },
    },

    // ===== Delivery Info =====
    {
      name: 'deliveryLocation',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
          required: true,
          admin: { description: 'Full text address for deliverylocation' },
        },
        {
          name: 'coordinates',
          type: 'array',
          required: true,
          minRows: 2,
          maxRows: 2,
          fields: [
            {
              name: 'value',
              type: 'number',
            },
          ],
          admin: { description: '[longitude, latitude]' },
          validate: (values: unknown) => {
            if (!Array.isArray(values) || values.length !== 2) {
              return 'Coordinates must be an array of [longitude, latitude]'
            }
            const coords = values.map((entry) => {
              if (typeof entry === 'number') return entry
              if (entry && typeof entry === 'object' && 'value' in entry) {
                return (entry as { value?: unknown }).value
              }
              return undefined
            })
            if (!coords.every((v) => typeof v === 'number' && Number.isFinite(v))) {
              return 'Both coordinates must be numbers'
            }
            return true
          },
        },
      ],
      admin: { description: 'Full delivery address / location pin' },
    },
    {
      name: 'instructions',
      type: 'textarea',
      admin: { description: 'Special instructions for delivery' },
    },

    // ===== Order Statuses =====
    {
      name: 'orderStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'In Transit', value: 'in-transit' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      admin: { description: 'Current status of the order' },
    },
    {
      name: 'refundStatus',
      type: 'select',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Requested', value: 'requested' },
        { label: 'Processed', value: 'processed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'none',
      admin: { description: 'Refund status for this order' },
    },

    // Cancellation info group
    {
      name: 'cancellation',
      type: 'group',
      admin: { description: 'Details about order cancellation if applicable' },
      fields: [
        { name: 'reason', type: 'textarea', admin: { description: 'Reason for cancellation' } },
        {
          name: 'required',
          type: 'checkbox',
          admin: { description: 'Is a cancellation reason required?' },
        },
        {
          name: 'cancelledAt',
          type: 'date',
          admin: { description: 'Date/time the order was cancelled' },
        },
      ],
    },

    // ===== Payment Info =====
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
      admin: { description: 'Current payment status' },
    },
    { name: 'stripeSessionId', type: 'text', admin: { description: 'Stripe checkout session ID' } },
    {
      name: 'stripePaymentIntentId',
      type: 'text',
      admin: { description: 'Stripe payment intent ID' },
    },

    // ===== Payout Info =====
    {
      name: 'payoutStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
      admin: { description: 'Payout status for the shop owner' },
    },
    {
      name: 'stripeTransferId',
      type: 'text',
      admin: { description: 'Stripe transfer ID for payout' },
    },

    // ===== Fulfillment =====
    {
      name: 'fulfillmentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      admin: { description: 'Delivery fulfillment status' },
    },

    // ===== Timestamps =====
    { name: 'createdAt', type: 'date', admin: { description: 'Order creation timestamp' } },
    { name: 'paidAt', type: 'date', admin: { description: 'Payment completion timestamp' } },
    { name: 'deliveredAt', type: 'date', admin: { description: 'Delivery completion timestamp' } },
    { name: 'payoutAt', type: 'date', admin: { description: 'Payout sent timestamp' } },
  ],

  // ===== Hooks =====
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation !== 'create') {
          return data
        }

        const counter = await req.payload.find({
          collection: 'order-counter',
          limit: 1,
          depth: 0,
          overrideAccess: true,
        })

        const next = (counter.docs[0]?.value || 0) + 1

        if (counter.docs[0]) {
          await req.payload.update({
            collection: 'order-counter',
            id: counter.docs[0].id,
            data: { value: next },
            overrideAccess: true,
          })
        } else {
          await req.payload.create({
            collection: 'order-counter',
            data: { value: next },
            overrideAccess: true,
          })
        }

        data.orderNumber = next

        return data
      },
    ],
  },
}
