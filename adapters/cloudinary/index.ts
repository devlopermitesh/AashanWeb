// src/adapters/cloudinaryAdapter.ts
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import cloudinary from '@/collections/lib/cloudinary'
import { UploadApiResponse } from 'cloudinary'
import { getStaticHandler } from './hooks/staticHandler'
import { FileDataWithCloudinary } from './types'

export interface CloudinaryAdapterArgs {
  cloudName: string
  folder?: string
}

export const cloudinaryAdapter = ({
  cloudName,
  folder = 'payload-uploads',
}: CloudinaryAdapterArgs): Adapter => {
  return ({ collection }): GeneratedAdapter => {
    const folderPath = folder

    return {
      name: 'cloudinary',

      // ✅ Upload file to Cloudinary
      handleUpload: async ({ data, file }) => {
        try {
          // Determine resource type based on mimetype
          let resourceType: 'image' | 'video' | 'raw' = 'raw'
          if (file.mimeType?.startsWith('image/')) {
            resourceType = 'image'
          } else if (file.mimeType?.startsWith('video/')) {
            resourceType = 'video'
          }

          // Generate public ID
          const publicId = `${folderPath}/${data.filename || file.filename}`.replace(
            /\.[^/.]+$/,
            ''
          )

          const FilePath: string = `data:${file.mimeType};base64,${file.buffer.toString('base64')}`
          // Upload to Cloudinary
          const result: UploadApiResponse = await cloudinary.uploader.upload(FilePath, {
            public_id: publicId,
            folder: folderPath,
            resource_type: resourceType,
            overwrite: false,
            unique_filename: true,
          })

          console.log('✅ Uploaded to Cloudinary:', result.secure_url)

          return {
            ...data,
            // Store Cloudinary metadata
            cloudinary: {
              public_id: result.public_id,
              version: result.version,
              signature: result.signature,
              width: result.width,
              height: result.height,
              format: result.format,
              resource_type: result.resource_type,
              created_at: result.created_at,
              bytes: result.bytes,
              type: result.type,
              url: result.url,
              secure_url: result.secure_url,
            },
            // Override URL to use Cloudinary
            url: result.secure_url,
            filename: result.original_filename || data.filename,
            mimeType: file.mimeType,
            filesize: result.bytes,
            width: result.width,
            height: result.height,
          }
        } catch (error) {
          console.error('❌ Cloudinary upload failed:', error)
          throw error
        }
      },

      // ✅ Delete file from Cloudinary
      handleDelete: async ({ doc }) => {
        try {
          // Get public_id from doc
          const docData = doc as FileDataWithCloudinary
          const publicId = docData?.cloudinary?.public_id
          const resourceType = docData?.cloudinary?.resource_type || 'image'

          if (!publicId) {
            console.warn('⚠️ No public_id found for deletion')
            return
          }

          // Delete from Cloudinary
          const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true, // Invalidate CDN cache
          })

          if (result.result === 'ok') {
            console.log('✅ Deleted from Cloudinary:', publicId)
          } else {
            console.warn('⚠️ Cloudinary deletion result:', result)
          }
        } catch (error) {
          console.error('❌ Cloudinary delete failed:', error)
        }
      },

      // ✅ Generate URL (for accessing the file)
      generateURL: ({ filename }) => {
        // URL is already stored in doc.url from handleUpload
        // This is a fallback if needed
        return `https://res.cloudinary.com/${cloudName}/image/upload/${folderPath}/${filename}`
      },

      // ✅ Static handler (serves files in admin)
      staticHandler: getStaticHandler({
        cloudinary,
        collection,
        folder: folderPath,
      }),
    }
  }
}
