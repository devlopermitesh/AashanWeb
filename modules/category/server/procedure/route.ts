import { Category } from "@/payload-types";
import { createrouter, publicProcedure } from "@/server/trpc";

export const categoryRouter = createrouter({
  greeting: publicProcedure.query(() => {
    return { message: "Hello world" };
  }),
  getMany: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db.find({
      depth: 1,
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
      collection: "categories",
    });

    const data: Category[] = result.docs;
    //Results.docs have both SubCategories and Parent 'Filter Parents Only'
    const filterParentCategories: Category[] = data.map((doc) => ({
      ...doc,
      subcategories: {
        docs:
          doc.subcategories?.docs?.map((subdoc) => ({
            ...(subdoc as Category),
            subcategories: undefined, // remove nested sub-subcategories
          })) ?? [],
        hasNextPage: false,
        totalDocs: doc.subcategories?.docs?.length ?? 0,
      },
    }));

    return filterParentCategories;
  }),
});
