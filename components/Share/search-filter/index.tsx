import SearchInput from "./SearchInput";
import Categories from "./Categories";
import { Category } from "@/payload-types";
import { getPayloadClient } from "@/lib/payload";

const SearchFilter = async () => {
  const payload = await getPayloadClient();

  const result = await payload.find({
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

  return (
    <div className="flex flex-col w-full sm:px-10 px-2 items-center py-5 gap-4 h-auto ">
      <SearchInput data={filterParentCategories} />
      <Categories data={filterParentCategories} />
    </div>
  );
};

export default SearchFilter;
