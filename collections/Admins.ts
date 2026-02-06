// collections/Admins.ts
import type { CollectionConfig } from "payload";

const Admins: CollectionConfig = {
  slug: "admins",
  auth: true,
  fields: [
    { name: "name", type: "text" },
  ],
};

export default Admins;
