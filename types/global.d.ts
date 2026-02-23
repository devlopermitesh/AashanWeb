export {}

// Create a type for the Roles
export type Roles = 'org:shop_owner' | 'user' | 'super-admin'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      roles?: Roles[]
    }
  }
}
