import type { Block } from 'payload'

export const ProductGridBlock: Block = {
  slug: 'productGrid',
  labels: {
    singular: 'Product Grid',
    plural: 'Product Grids',
  },
  fields: [
    // ===== CONTENT SETTINGS =====
    {
      name: 'content',
      type: 'group',
      label: 'Content',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 100,
          defaultValue: 'Featured Products',
          admin: {
            description: 'Section title',
          },
        },

        {
          name: 'showTitle',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Title',
        },

        {
          name: 'description',
          type: 'textarea',
          maxLength: 200,
          admin: {
            description: 'Optional subtitle/description',
            rows: 2,
          },
        },

        {
          name: 'showDescription',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Description',
        },

        // ===== SOURCE SELECTION =====
        {
          name: 'source',
          type: 'select',
          required: true,
          defaultValue: 'category',
          options: [
            {
              label: 'Category',
              value: 'category',
            },
            {
              label: 'Collection',
              value: 'collection',
            },
            {
              label: 'Manual Selection',
              value: 'manual',
            },
          ],
          admin: {
            description: 'Where to get products from',
          },
        },

        // ===== CATEGORY SOURCE =====
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: false,
          hasMany: true,
          admin: {
            condition: (data) => data?.content?.source === 'category',
            description: 'Select category to display',
          },
        },

        // ===== COLLECTION SOURCE =====
        {
          name: 'collection',
          type: 'relationship',
          relationTo: 'collections',
          required: false,
          admin: {
            condition: (data) => data?.content?.source === 'collection',
            description: 'Select collection to display',
          },
        },

        // ===== MANUAL SOURCE =====
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          required: false,
          admin: {
            condition: (data) => data?.content?.source === 'manual',
            description: 'Manually select products (order matters)',
          },
        },

        {
          name: 'limit',
          type: 'number',
          required: true,
          defaultValue: 10,
          min: 1,
          max: 50,
          admin: {
            description: 'Max products to show (Free: max 10, Pro: max 50)',
            step: 1,
          },
        },
        // Todo: we need to add Product field feature yet
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Featured Products Only',
          admin: {
            description: 'Only show products marked as featured',
          },
        },
      ],
    },

    // ===== LAYOUT SETTINGS =====
    {
      name: 'layout',
      type: 'group',
      label: 'Layout',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'grid',
          options: [
            {
              label: 'Grid',
              value: 'grid',
            },
            {
              label: 'Carousel',
              value: 'carousel',
            },
            {
              label: 'Masonry',
              value: 'masonry',
            },
          ],
          admin: {
            description: 'Choose layout type',
          },
        },

        // ===== GRID SPECIFIC SETTINGS =====
        {
          name: 'gridColumns',
          type: 'select',
          required: false,
          defaultValue: 'preset-2',
          options: [
            {
              label: 'Preset 1 (4-2-1)',
              value: 'preset-1',
            },
            {
              label: 'Preset 2 (3-2-1)',
              value: 'preset-2',
            },
            {
              label: 'Preset 3 (6-3-2)',
              value: 'preset-3',
            },
            {
              label: 'Auto',
              value: 'auto',
            },
          ],
          admin: {
            condition: (data) => data?.layout?.type === 'grid',
            description: 'Responsive columns (Desktop-Tablet-Mobile)',
          },
        },

        // ===== CAROUSEL SPECIFIC SETTINGS =====
        {
          name: 'carouselItems',
          type: 'select',
          required: false,
          defaultValue: '3',
          options: [
            {
              label: '1 Item',
              value: '1',
            },
            {
              label: '2 Items',
              value: '2',
            },
            {
              label: '3 Items',
              value: '3',
            },
            {
              label: '4 Items',
              value: '4',
            },
          ],
          admin: {
            condition: (data) => data?.layout?.type === 'carousel',
            description: 'Items visible per view',
          },
        },

        {
          name: 'carouselAutoScroll',
          type: 'checkbox',
          defaultValue: false,
          label: 'Auto Scroll',
          admin: {
            condition: (data) => data?.layout?.type === 'carousel',
          },
        },

        {
          name: 'carouselSpeed',
          type: 'select',
          required: false,
          defaultValue: '5',
          options: [
            { label: 'Slow (3s)', value: '3' },
            { label: 'Normal (5s)', value: '5' },
            { label: 'Fast (7s)', value: '7' },
          ],
          admin: {
            condition: (data) =>
              data?.layout?.type === 'carousel' && data?.layout?.carouselAutoScroll,
            description: 'Auto scroll interval',
          },
        },

        // ===== GAP/SPACING =====
        {
          name: 'gap',
          type: 'select',
          required: true,
          defaultValue: '24',
          options: [
            { label: '16px', value: '16' },
            { label: '24px', value: '24' },
            { label: '32px', value: '32' },
            { label: '40px', value: '40' },
          ],
          admin: {
            description: 'Space between items',
          },
        },
      ],
    },

    // ===== PRODUCT CARD DESIGN =====
    {
      name: 'card',
      type: 'group',
      label: 'Product Card Design',
      fields: [
        // ===== IMAGE SETTINGS =====
        {
          name: 'imageAspect',
          type: 'select',
          required: true,
          defaultValue: 'square',
          options: [
            { label: 'Square (1:1)', value: 'square' },
            { label: 'Wide (16:9)', value: '16:9' },
            { label: 'Tall (9:16)', value: '9:16' },
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
          ],
          admin: {
            description: 'Product image aspect ratio',
          },
        },

        {
          name: 'imageHover',
          type: 'select',
          required: true,
          defaultValue: 'zoom',
          options: [
            { label: 'Zoom', value: 'zoom' },
            { label: 'Fade', value: 'fade' },
            { label: 'Slide', value: 'slide' },
            { label: 'None', value: 'none' },
          ],
          admin: {
            description: 'Hover effect on image',
          },
        },

        // ===== CARD STYLE GROUP =====
        {
          name: 'style',
          type: 'group',
          fields: [
            {
              name: 'borderRadius',
              type: 'select',
              required: true,
              defaultValue: '12',
              options: [
                { label: 'None (0px)', value: '0' },
                { label: 'Small (4px)', value: '4' },
                { label: 'Medium (8px)', value: '8' },
                { label: 'Large (12px)', value: '12' },
                { label: 'Extra Large (16px)', value: '16' },
                { label: 'Full (9999px)', value: '9999' },
              ],
              admin: {
                description: 'Card corner radius',
              },
            },

            {
              name: 'shadow',
              type: 'select',
              required: true,
              defaultValue: 'light',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Light', value: 'light' },
                { label: 'Medium', value: 'medium' },
                { label: 'Heavy', value: 'heavy' },
              ],
              admin: {
                description: 'Card shadow intensity',
              },
            },

            {
              name: 'backgroundColor',
              type: 'text',
              defaultValue: '#ffffff',
              admin: {
                description: 'Card background color (hex)',
                components: {
                  Field: '@/modules/admin/ui/colorpicker#ColorPicker',
                },
              },
            },

            {
              name: 'showBorder',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show Border',
            },

            {
              name: 'borderColor',
              type: 'text',
              defaultValue: '#e5e5e5',
              admin: {
                condition: (data) => data?.card?.style?.showBorder,
                components: {
                  Field: '@/modules/admin/ui/colorpicker#ColorPicker',
                },
                description: 'Border color (hex)',
              },
            },

            {
              name: 'borderWidth',
              type: 'select',
              defaultValue: '1',
              options: [
                { label: '1px', value: '1' },
                { label: '2px', value: '2' },
                { label: '3px', value: '3' },
              ],
              admin: {
                condition: (data) => data?.card?.style?.showBorder,
              },
            },
          ],
        },

        // ===== PADDING =====
        {
          name: 'padding',
          type: 'select',
          required: true,
          defaultValue: '16',
          options: [
            { label: 'Small (8px)', value: '8' },
            { label: 'Medium (12px)', value: '12' },
            { label: 'Large (16px)', value: '16' },
            { label: 'Extra Large (20px)', value: '20' },
          ],
          admin: {
            description: 'Internal card padding',
          },
        },
      ],
    },

    // ===== WHAT TO DISPLAY =====
    {
      name: 'display',
      type: 'group',
      label: 'What to Show',
      fields: [
        {
          name: 'image',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Product Image',
        },

        {
          name: 'title',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show Product Title',
        },

        // ===== PRICE =====
        {
          name: 'price',
          type: 'group',
          fields: [
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Price',
            },

            {
              name: 'format',
              type: 'select',
              defaultValue: 'default',
              options: [
                {
                  label: 'Default (99)',
                  value: 'default',
                },
                // {
                //   label: 'With Discount ($99 → $79)',
                //   value: 'with-discount',
                // },
                // {
                //   label: 'Range ($79 - $129)',
                //   value: 'range',
                // },
              ],
              admin: {
                condition: (data) => data?.display?.price?.show,
              },
            },
          ],
        },

        // ===== RATING =====
        {
          name: 'rating',
          type: 'group',
          fields: [
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Rating',
            },

            {
              name: 'style',
              type: 'select',
              defaultValue: 'stars',
              options: [
                { label: 'Stars ⭐⭐⭐⭐', value: 'stars' },
                { label: 'Number (4.5)', value: 'number' },
              ],
              admin: {
                condition: (data) => data?.display?.rating?.show,
              },
            },

            {
              name: 'showCount',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Review Count',
              admin: {
                condition: (data) => data?.display?.rating?.show,
              },
            },
          ],
        },

        // ===== CATEGORY =====
        {
          name: 'category',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Category',
        },

        // ===== BADGES =====
        {
          name: 'badge',
          type: 'group',
          fields: [
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Badges',
            },

            {
              name: 'style',
              type: 'select',
              defaultValue: 'both',
              options: [
                { label: 'Sale Badge Only', value: 'sale' },
                { label: 'New Badge Only', value: 'new' },
                { label: 'Both', value: 'both' },
              ],
              admin: {
                condition: (data) => data?.display?.badge?.show,
              },
            },

            {
              name: 'position',
              type: 'select',
              defaultValue: 'top-right',
              options: [
                { label: 'Top Left', value: 'top-left' },
                { label: 'Top Right', value: 'top-right' },
                { label: 'Bottom Left', value: 'bottom-left' },
                { label: 'Bottom Right', value: 'bottom-right' },
              ],
              admin: {
                condition: (data) => data?.display?.badge?.show,
              },
            },
          ],
        },

        // ===== DESCRIPTION =====
        {
          name: 'description',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Description',
        },

        // ===== STOCK STATUS =====
        {
          name: 'stock',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Stock Status',
        },
      ],
    },

    // ===== ACTIONS / BUTTONS =====
    {
      name: 'actions',
      type: 'group',
      label: 'Product Actions',
      fields: [
        // ===== ADD TO CART =====
        {
          name: 'addToCart',
          type: 'group',
          fields: [
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show Add to Cart',
            },

            {
              name: 'style',
              type: 'select',
              defaultValue: 'button',
              options: [
                { label: 'Button', value: 'button' },
                { label: 'Icon Only', value: 'icon' },
                { label: 'Button + Icon', value: 'button-icon' },
              ],
              admin: {
                condition: (data) => data?.actions?.addToCart?.show,
              },
            },

            {
              name: 'text',
              type: 'text',
              defaultValue: 'Add to Cart',
              maxLength: 30,
              admin: {
                condition: (data) => data?.actions?.addToCart?.show,
              },
            },

            {
              name: 'fullWidth',
              type: 'checkbox',
              defaultValue: false,
              label: 'Full Width Button',
              admin: {
                condition: (data) =>
                  data?.actions?.addToCart?.show && data?.actions?.addToCart?.style !== 'icon',
              },
            },
          ],
        },

        // ===== QUICK VIEW (PRO ONLY) =====
        {
          name: 'quickView',
          type: 'group',
          fields: [
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show Quick View (Pro)',
              admin: {
                description: 'Pro feature - may be disabled based on plan',
              },
            },
          ],
        },

        // ===== WISHLIST (PRO ONLY) =====
        {
          name: 'wishlist',
          type: 'group',
          fields: [
            {
              name: 'show',
              type: 'checkbox',
              defaultValue: false,
              label: 'Show Wishlist (Pro)',
              admin: {
                description: 'Pro feature - may be disabled based on plan',
              },
            },
          ],
        },

        // ===== SHARE =====
        {
          name: 'share',
          type: 'checkbox',
          defaultValue: false,
          label: 'Show Share Button',
        },
      ],
    },

    // ===== SORTING & DATA =====
    {
      name: 'data',
      type: 'group',
      label: 'Sorting & Data',
      fields: [
        {
          name: 'sortBy',
          type: 'select',
          required: true,
          defaultValue: 'manual',
          options: [
            { label: 'Manual Order', value: 'manual' },
            { label: 'Newest', value: 'newest' },
            { label: 'Bestseller', value: 'bestseller' },
            { label: 'Price: Low to High', value: 'price-low' },
            { label: 'Price: High to Low', value: 'price-high' },
            { label: 'Top Rated', value: 'rating' },
          ],
          admin: {
            description: 'How to sort products',
          },
        },

        // {
        //   name: 'sortAllowCustomer',
        //   type: 'checkbox',
        //   defaultValue: false,
        //   label: 'Allow Customers to Sort',
        //   admin: {
        //     description: 'Show sort dropdown on frontend',
        //   },
        // },
      ],
    },

    // ===== PAGINATION =====
    {
      name: 'pagination',
      type: 'group',
      label: 'Pagination',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          defaultValue: 'none',
          options: [
            { label: 'None (Show All)', value: 'none' },
            { label: 'Traditional Pagination', value: 'pagination' },
            { label: 'Load More Button', value: 'load-more' },
            { label: 'Infinite Scroll', value: 'infinite-scroll' },
          ],
          admin: {
            description: 'How customers navigate through products',
          },
        },

        {
          name: 'itemsPerPage',
          type: 'number',
          defaultValue: 12,
          min: 6,
          max: 50,
          admin: {
            condition: (data) =>
              data?.pagination?.type !== 'none' && data?.pagination?.type !== 'infinite-scroll',
            description: 'Items per page',
          },
        },

        {
          name: 'loadMoreText',
          type: 'text',
          defaultValue: 'Load More',
          maxLength: 30,
          admin: {
            condition: (data) => data?.pagination?.type === 'load-more',
          },
        },
      ],
    },

    // ===== VISIBILITY =====
    {
      name: 'visibility',
      type: 'group',
      label: 'Visibility',
      fields: [
        {
          name: 'showOnMobile',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show on Mobile',
        },

        {
          name: 'showOnTablet',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show on Tablet',
        },

        {
          name: 'showOnDesktop',
          type: 'checkbox',
          defaultValue: true,
          label: 'Show on Desktop',
        },
      ],
    },

    // ===== ANALYTICS =====
    {
      name: 'analytics',
      type: 'group',
      label: 'Analytics & Tracking',
      fields: [
        {
          name: 'trackingId',
          type: 'text',
          admin: {
            description: 'Unique ID for analytics tracking',
            placeholder: 'products_featured_001',
          },
        },

        {
          name: 'goalType',
          type: 'select',
          options: [
            { label: 'Sales', value: 'sales' },
            { label: 'Views', value: 'views' },
            { label: 'Engagement', value: 'engagement' },
          ],
          admin: {
            description: 'What conversion goal to track',
          },
        },
      ],
    },

    // ===== BLOCK MANAGEMENT =====
    {
      name: 'blockSettings',
      type: 'group',
      label: 'Block Settings',
      fields: [
        {
          name: 'isVisible',
          type: 'checkbox',
          defaultValue: true,
          label: 'Visible',
        },

        {
          name: 'order',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Order in template (0, 1, 2...)',
          },
        },
      ],
    },
  ],
}
