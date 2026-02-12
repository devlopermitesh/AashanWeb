import { getPayloadClient } from "@/lib/payload";
import { Payload } from "payload";
import payload from "payload";

const seedCategories = async (payload: Payload) => {
  // Clear existing categories
  await payload.delete({
    collection: "categories",
    where: {},
  });

  // 20 Parent Categories with color
  const parentCategoriesData = [
    { name: "Clothing", slug: "clothing", color: "#FDE68A" },
    { name: "Electronics", slug: "electronics", color: "#93C5FD" },
    { name: "Beauty", slug: "beauty", color: "#FCA5A5" },
    { name: "Sports", slug: "sports", color: "#A7F3D0" },
    { name: "Home", slug: "home", color: "#FCD34D" },
    { name: "Toys", slug: "toys", color: "#C084FC" },
    { name: "Books", slug: "books", color: "#F87171" },
    { name: "Music", slug: "music", color: "#60A5FA" },
    { name: "Garden", slug: "garden", color: "#34D399" },
    { name: "Office", slug: "office", color: "#FBBF24" },
    { name: "Health", slug: "health", color: "#F472B6" },
    { name: "Automotive", slug: "automotive", color: "#A5B4FC" },
    { name: "Pet Supplies", slug: "pet-supplies", color: "#F87171" },
    { name: "Jewelry", slug: "jewelry", color: "#FCD34D" },
    { name: "Shoes", slug: "shoes", color: "#93C5FD" },
    { name: "Accessories", slug: "accessories", color: "#FCA5A5" },
    { name: "Groceries", slug: "groceries", color: "#34D399" },
    { name: "Travel", slug: "travel", color: "#FBBF24" },
    { name: "Gaming", slug: "gaming", color: "#C084FC" },
    { name: "Art", slug: "art", color: "#F472B6" },
  ];

  // Create parent categories
  const parents = await Promise.all(
    parentCategoriesData.map((cat) =>
      payload.create({
        collection: "categories",
        data: cat,
      }),
    ),
  );

  // Generate 5–6 subcategories for each parent
  for (const parent of parents) {
    for (let i = 1; i <= 5; i++) {
      await payload.create({
        collection: "categories",
        data: {
          name: `${parent.name} Subcategory ${i}`,
          slug: `${parent.slug}-sub${i}`,
          parent: parent.id,
          color: parent.color, // same color as parent
        },
      });
    }
  }

  console.log("✅ Seeded 20 parent categories with 5 subcategories each!");
};

const run = async () => {
  const payload = await getPayloadClient();

  await seedCategories(payload);
  process.exit(0);
};

run();
