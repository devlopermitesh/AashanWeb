// src/adapters/staticHandler.ts
import type { StaticHandler } from '@payloadcms/plugin-cloud-storage/types'
import type { CollectionConfig } from 'payload'
import type { v2 as cloudinaryType } from 'cloudinary'
import path from 'path'
import { getResourceType, getMimeType } from '../utils'

interface StaticHandlerArgs {
  cloudinary: typeof cloudinaryType
  collection: CollectionConfig
  folder: string
}

export const getStaticHandler = ({
  cloudinary,
  collection,
  folder,
}: StaticHandlerArgs): StaticHandler => {
  return async (req, { params: { filename } }) => {
    try {
      console.log('🔍 Static handler called for:', filename)

      // ✅ Parse filename for size suffix (e.g., image-400x300.png)
      const sizeMatch = filename.match(/^(.+)-(\d+)x(\d+)(\.\w+)$/)

      let baseFilename = filename
      let width: number | undefined
      let height: number | undefined

      if (sizeMatch) {
        // Extract: image-400x300.png → image.png, 400, 300
        const [, name, w, h, ext] = sizeMatch
        baseFilename = name + ext
        width = parseInt(w)
        height = parseInt(h)

        console.log('📏 Detected size request:', { baseFilename, width, height })
      }

      // Construct file path
      const filePath = `media/${folder}/${baseFilename}`
      console.log('🔍 Looking for file:', filePath)

      // Get file extension and resource type
      const fileExt = path.extname(baseFilename).toLowerCase()
      const resourceType = getResourceType(fileExt)
      const mimeType = getMimeType(fileExt)

      // Check for special requests
      const url = new URL(req.url!)
      const isPdfThumbnail = fileExt === '.pdf' && url.searchParams.get('thumbnail') === 'true'

      // Try to find the resource in Cloudinary
      const cloudinaryUrl = await findCloudinaryResource({
        cloudinary,
        filePath,
        folder,
        baseFilename,
        resourceType,
      })

      if (!cloudinaryUrl) {
        req.payload.logger.warn({
          message: 'Resource not found in Cloudinary',
          path: filePath,
          filename,
        })
        return new Response('Not Found', { status: 404 })
      }

      console.log('✅ Found in Cloudinary:', cloudinaryUrl)

      // ✅ Apply transformations
      let finalUrl = cloudinaryUrl

      if (width || height) {
        // Apply size transformation
        finalUrl = addSizeTransformation(cloudinaryUrl, { width, height })
        console.log('🎨 Applied size transformation:', finalUrl)
      } else if (isPdfThumbnail) {
        finalUrl = addPdfThumbnailTransformation(cloudinaryUrl)
      }

      // Fetch the file from Cloudinary
      const response = await fetch(finalUrl)

      if (!response.ok) {
        return new Response('Not Found', { status: 404 })
      }

      // Get the blob
      const blob = await response.blob()

      // Handle ETag for caching
      const etag = generateETag(filePath, blob.size)
      const clientEtag = req.headers.get('if-none-match')

      if (clientEtag === etag) {
        return new Response(null, {
          status: 304,
          headers: {
            'Content-Type': mimeType,
            ETag: etag,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      }

      // Return the file
      return new Response(blob, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Length': String(blob.size),
          ETag: etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } catch (error) {
      req.payload.logger.error({
        error,
        message: 'Error in static handler',
        filename,
      })
      return new Response('Internal Server Error', { status: 500 })
    }
  }
}

/**
 * Try to find resource in Cloudinary
 */
async function findCloudinaryResource({
  cloudinary,
  filePath,
  folder,
  baseFilename,
  resourceType,
}: {
  cloudinary: typeof cloudinaryType
  filePath: string
  folder: string
  baseFilename: string
  resourceType: 'image' | 'video' | 'raw'
}): Promise<string | null> {
  // ✅ Try 1: Exact path without extension
  const publicIdWithoutExt = filePath.replace(/\.[^/.]+$/, '')
  console.log('🔍 Try 1 - Without extension:', publicIdWithoutExt)

  try {
    const result = await cloudinary.api.resource(publicIdWithoutExt, {
      resource_type: resourceType,
    })

    if (result?.secure_url) {
      console.log('✅ Found (without extension)')
      return result.secure_url
    }
  } catch (error) {
    console.log('⚠️ Not found without extension')
  }

  // ✅ Try 2: With extension
  console.log('🔍 Try 2 - With extension:', filePath)

  try {
    const result = await cloudinary.api.resource(filePath, {
      resource_type: resourceType,
    })

    if (result?.secure_url) {
      console.log('✅ Found (with extension)')
      return result.secure_url
    }
  } catch (error) {
    console.log('⚠️ Not found with extension')
  }

  // ✅ Try 3: Search by prefix (last resort)
  console.log('🔍 Try 3 - Searching by prefix:', baseFilename)

  try {
    const searchResult = await cloudinary.search
      .expression(`folder:${folder} AND filename:${baseFilename.replace(/\.[^/.]+$/, '')}`)
      .max_results(1)
      .execute()

    if (searchResult.resources && searchResult.resources.length > 0) {
      console.log('✅ Found via search')
      return searchResult.resources[0].secure_url
    }
  } catch (error) {
    console.log('⚠️ Search failed')
  }

  return null
}

/**
 * Add size transformation to Cloudinary URL
 */
function addSizeTransformation(url: string, options: { width?: number; height?: number }): string {
  const urlParts = url.split('/upload/')

  if (urlParts.length === 2) {
    const transformations: string[] = []

    if (options.width) transformations.push(`w_${options.width}`)
    if (options.height) transformations.push(`h_${options.height}`)

    // Add crop and quality
    transformations.push('c_fill', 'q_auto', 'f_auto')

    const transform = transformations.join(',')
    return `${urlParts[0]}/upload/${transform}/${urlParts[1]}`
  }

  return url
}

/**
 * Add PDF thumbnail transformation
 */
function addPdfThumbnailTransformation(url: string): string {
  const urlParts = url.split('/upload/')

  if (urlParts.length === 2) {
    return `${urlParts[0]}/upload/pg_1,f_jpg,q_auto,w_400/${urlParts[1]}`
  }

  return url
}

/**
 * Generate simple ETag
 */
function generateETag(path: string, size: number): string {
  const hash = `${path}-${size}`
  return `"${Buffer.from(hash).toString('base64')}"`
}
