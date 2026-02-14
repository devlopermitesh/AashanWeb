import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import Admins from './collections/Admins'
import Users from './collections/Users'
import Media from './collections/Media'
import Categories from './collections/Categories'

import { cloudinaryStorage } from 'payload-cloudinary'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  email: nodemailerAdapter({
    transportOptions: {
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    },
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS!,
    defaultFromName: process.env.EMAIL_FROM_NAME!,
  }),
  collections: [Users, Media, Admins, Categories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  sharp,
  plugins: [
    cloudinaryStorage({
      config: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
        api_key: process.env.CLOUDINARY_API_KEY!,
        api_secret: process.env.CLOUDINARY_API_SECRET!,
      },
      collections: {
        media: true, // ← tumhara slug 'media' hai, to yaha true kar do
        // agar aur upload collections hain to unko bhi add kar sakte ho
      },
      // optional settings (agar chahiye to)
      // enabled: true,
      folder: 'aashanweb/media', // Cloudinary mein folder organize karne ke liye
    }),
  ],
})
