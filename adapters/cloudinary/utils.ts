// src/adapters/utils.ts

/**
 * Get Cloudinary resource type based on file extension
 */
export function getResourceType(fileExtension: string): 'image' | 'video' | 'raw' {
  const ext = fileExtension.toLowerCase().replace('.', '')

  // Image types
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'avif']

  // Video types
  const videoTypes = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'webm', 'mkv', 'm4v', 'mpeg', 'mpg']

  if (imageTypes.includes(ext)) {
    return 'image'
  }

  if (videoTypes.includes(ext)) {
    return 'video'
  }

  return 'raw'
}

/**
 * Get MIME type based on file extension
 */
export function getMimeType(fileExtension: string): string {
  const ext = fileExtension.toLowerCase().replace('.', '')

  const mimeTypes: Record<string, string> = {
    // Images
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    svg: 'image/svg+xml',
    bmp: 'image/bmp',
    ico: 'image/x-icon',
    tiff: 'image/tiff',
    avif: 'image/avif',

    // Videos
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    wmv: 'video/x-ms-wmv',
    flv: 'video/x-flv',
    webm: 'video/webm',
    mkv: 'video/x-matroska',
    m4v: 'video/x-m4v',
    mpeg: 'video/mpeg',
    mpg: 'video/mpeg',

    // Documents
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    xls: 'application/vnd.ms-excel',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ppt: 'application/vnd.ms-powerpoint',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    txt: 'text/plain',
    csv: 'text/csv',

    // Archives
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    tar: 'application/x-tar',
    gz: 'application/gzip',

    // Audio
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    m4a: 'audio/mp4',
  }

  return mimeTypes[ext] || 'application/octet-stream'
}
