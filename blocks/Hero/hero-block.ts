import { Block } from 'payload'
export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  interfaceName: 'HeroBlock',
  fields: [
    // ===== LAYOUT & CONTENT =====
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'imageRight',
      options: [
        { label: 'Image Right (Default)', value: 'imageRight' },
        { label: 'Image Left', value: 'imageLeft' },
        { label: 'Centered (Full Width)', value: 'centered' },
        { label: 'Image Only', value: 'imageOnly' },
        { label: 'Text Only', value: 'textOnly' },
      ],
      admin: {
        description: 'Choose layout structure',
      },
    },
    //=====varient ========
    {
      name: 'variant',
      type: 'text',
      defaultValue: 'default',
    },
    {
      name: 'disabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        // ===== HEADLINE (Required) =====
        {
          name: 'heading',
          type: 'text',
          required: true,
          maxLength: 100,
          admin: {
            description: 'Main headline (max 100 chars for mobile)',
          },
        },

        // ===== SUBHEADING (Optional) =====
        {
          name: 'subheading',
          type: 'textarea',
          admin: {
            description: 'Supporting text (max 200 chars)',
          },
        },

        // ===== IMAGE (Conditional - not required for text-only) =====
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
          admin: {
            condition: (data) => data.type !== 'textOnly',
            description: 'Upload hero image (recommended: 1200x600px)',
          },
        },

        // ===== FALLBACK IMAGE =====
        {
          name: 'fallbackImage',
          type: 'text',
          admin: {
            description: 'URL if main image fails to load',
          },
        },

        // ===== PRODUCT/CATEGORY HIGHLIGHT (Optional) =====
        {
          name: 'highlightedContent',
          type: 'group',
          fields: [
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'None', value: 'none' },
                { label: 'Product', value: 'product' },
                { label: 'Category', value: 'category' },
              ],
              defaultValue: 'none',
            },
            {
              name: 'product',
              type: 'relationship',
              relationTo: 'products',
              required: false,
              admin: {
                condition: (data) => data?.highlightedContent?.type === 'product',
              },
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              required: false,
              admin: {
                condition: (data) => data?.highlightedContent?.type === 'category',
              },
            },
          ],
        },

        // ===== CTA BUTTONS =====
        {
          name: 'cta',
          type: 'group',
          fields: [
            {
              name: 'primary',
              type: 'group',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  defaultValue: 'Shop Now',
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Internal path (e.g., /products) or external URL',
                  },
                },
                {
                  name: 'target',
                  type: 'select',
                  options: [
                    { label: 'Same Tab', value: '_self' },
                    { label: 'New Tab', value: '_blank' },
                  ],
                  defaultValue: '_self',
                },
              ],
            },
            {
              name: 'secondary',
              type: 'group',
              admin: {
                description: 'Optional secondary CTA',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                },
                {
                  name: 'href',
                  type: 'text',
                },
                {
                  name: 'target',
                  type: 'select',
                  options: [
                    { label: 'Same Tab', value: '_self' },
                    { label: 'New Tab', value: '_blank' },
                  ],
                  defaultValue: '_self',
                },
              ],
            },
          ],
        },

        // ===== STYLING =====
        {
          name: 'styling',
          type: 'group',
          fields: [
            // Background
            {
              name: 'bgColor',
              type: 'text',
              required: true,
              defaultValue: '#FCD34D', // yellow-300 (neobrutalism default)
              admin: {
                description: 'Background color (hex)',
                components: {
                  Field: '@/modules/admin/ui/colorpicker#ColorPicker',
                },
              },
            },

            // Text Colors
            {
              name: 'headingColor',
              type: 'text',
              required: true,
              defaultValue: '#000000',
              admin: {
                description: 'Heading text color (hex)',
                components: {
                  Field: '@/modules/admin/ui/colorpicker#ColorPicker',
                },
              },
            },

            {
              name: 'subheadingColor',
              type: 'text',
              required: true,
              defaultValue: '#1F2937',
              admin: {
                description: 'Subheading text color (hex)',
                components: {
                  Field: '@/modules/admin/ui/colorpicker#ColorPicker',
                },
              },
            },

            // Font Styling
            {
              name: 'headingFont',
              type: 'select',
              options: [
                { label: 'Inter (Sans)', value: 'inter' },
                { label: 'Playfair (Serif)', value: 'playfair' },
                { label: 'Bebas Neue (Display)', value: 'bebas' },
                { label: 'JetBrains Mono (Mono)', value: 'jetbrains' },
              ],
              defaultValue: 'inter',
            },

            // Border & Shadow
            {
              name: 'borderColor',
              type: 'text',
              defaultValue: '#000000',
              admin: {
                description: 'Border color for images (hex)',
                components: {
                  Field: '@/modules/admin/ui/colorpicker#ColorPicker',
                },
              },
            },

            {
              name: 'borderWidth',
              type: 'number',
              defaultValue: 4,
              admin: {
                description: 'Border width in pixels (neobrutalism style)',
              },
            },

            {
              name: 'shadowColor',
              type: 'text',
              defaultValue: '#000000',
              admin: {
                description: 'Shadow color (hex)',
                components: {
                  Field: '@/modules/admin/ui/colorpicker#ColorPicker',
                },
              },
            },

            {
              name: 'shadowOffset',
              type: 'number',
              defaultValue: 8,
              admin: {
                description: 'Shadow offset in pixels',
              },
            },

            // Responsive Padding
            {
              name: 'paddingMobile',
              type: 'number',
              defaultValue: 32,
              admin: {
                description: 'Mobile padding in pixels',
              },
            },

            {
              name: 'paddingDesktop',
              type: 'number',
              defaultValue: 80,
              admin: {
                description: 'Desktop padding in pixels',
              },
            },
          ],
        },

        // ===== SEO & METADATA =====
        {
          name: 'metadata',
          type: 'group',
          fields: [
            {
              name: 'altText',
              type: 'text',
              admin: {
                description: 'Image alt text for accessibility & SEO',
              },
            },
            {
              name: 'sectionTitle',
              type: 'text',
              admin: {
                description: 'For analytics tracking (optional)',
              },
            },
          ],
        },

        // ===== ANALYTICS =====
        {
          name: 'analytics',
          type: 'group',
          fields: [
            {
              name: 'trackingId',
              type: 'text',
              admin: {
                description: 'Custom event tracking ID',
              },
            },
            {
              name: 'conversionGoal',
              type: 'select',
              options: [
                { label: 'Product Sale', value: 'sale' },
                { label: 'Newsletter Signup', value: 'signup' },
                { label: 'Lead', value: 'lead' },
                { label: 'Traffic', value: 'traffic' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
