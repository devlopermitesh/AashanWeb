

export interface CloudinaryFile {
  public_id: string
  secure_url: string
  url: string
  format: string
  resource_type: 'image' | 'video' | 'raw'
  width?: number
  height?: number
  bytes: number
  created_at: string
}
