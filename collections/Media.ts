// collections/Media.ts

import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  access: {
    read: () => true,
  },

  upload: {
    staticDir: 'media', // Not used with Cloudinary, but required by Payload
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'feature',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
    },
    // //  Cloudinary metadata (added automatically by adapter)
    {
      name: 'cloudinary',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Cloudinary metadata',
      },
      fields: [
        {
          name: 'public_id',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'version',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'signature',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'width',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'height',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'format',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'resource_type',
          type: 'select',
          options: ['image', 'video', 'raw'],
          admin: { readOnly: true },
        },
        {
          name: 'created_at',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'bytes',
          type: 'number',
          admin: { readOnly: true },
        },
        {
          name: 'type',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'url',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'secure_url',
          type: 'text',
          admin: { readOnly: true },
        },
      ],
    },
  ],
}
