import type { Block } from 'payload'

export const NavbarBlock: Block = {
  slug: 'navbar',
  labels: {
    singular: 'Navbar',
    plural: 'Navbars',
  },
  interfaceName: 'NavbarBlock',
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'navbar',
      options: [{ label: 'Navbar', value: 'navbar' }],
      admin: {
        readOnly: true,
      },
    },
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
        {
          name: 'layout',
          type: 'select',
          required: true,
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Split', value: 'split' },
          ],
        },
        {
          name: 'sticky',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'logo',
          type: 'group',
          fields: [
            {
              name: 'type',
              type: 'select',
              defaultValue: 'text',
              options: [
                { label: 'Text Logo', value: 'text' },
                { label: 'Image Logo', value: 'image' },
              ],
            },
            //select Text field
            {
              name: 'text',
              type: 'text',
              admin: {
                condition: (_, siblingdata) => siblingdata?.type == 'text',
              },
            },
            {
              name: 'logo_image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingdata) => siblingdata?.type == 'image',
              },
            },
          ],
        },

        {
          name: 'href',
          type: 'group',
          fields: [
            {
              name: 'linkSource',
              type: 'select',
              options: [
                { label: 'Manual Links', value: 'manual' },
                { label: 'Auto from Categories', value: 'categories' },
              ],
              defaultValue: 'categories',
            },

            // 🟢 Show only when categories selected
            {
              name: 'categorieslink',
              type: 'relationship',
              relationTo: 'shopcategories',
              hasMany: true,
              maxRows: 5,
              admin: {
                condition: (_, siblingData) => siblingData?.linkSource === 'categories',
              },
            },

            // 🔵 Show only when manual selected
            {
              name: 'links',
              type: 'array',
              maxRows: 5,
              labels: {
                singular: 'Link',
                plural: 'Links',
              },
              admin: {
                condition: (_, siblingData) => siblingData?.linkSource === 'manual',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'external',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          name: 'showCTA',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'cta',
          type: 'group',
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
              name: 'variant',
              type: 'select',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Secondary', value: 'secondary' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'sticky',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Legacy support. Prefer settings.sticky.',
      },
    },
  ],
}
