
import type { CollectionConfig } from "payload";


 const Users: CollectionConfig = {
  slug: 'users',
  auth: false, // Disable Payload's built-in auth since Clerk handles it
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'clerkId',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'profileImage',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['user', 'admin', 'editor'],
      defaultValue: 'user',
    },
  ],
};
export default Users;