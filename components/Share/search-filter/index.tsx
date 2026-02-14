import SearchInput from "./SearchInput";
import Categories from "./Categories";
import { Category } from "@/payload-types";
import { getPayloadClient } from "@/lib/payload";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";

const SearchFilter = async () => {
  const payload = await getPayloadClient();

  return (
    <HydrateClient>
      <Suspense fallback={SearchSkelaton()}>
        <div className="flex flex-col w-full sm:px-10 px-2 items-center py-5 gap-4 h-auto ">
          <SearchInput />
          <Categories />
        </div>
      </Suspense>
    </HydrateClient>
  );
};

export default SearchFilter;
const SearchSkelaton = () => {
  return (
    <div className="flex flex-col w-full sm:px-10 px-2 items-center py-5 gap-4 h-auto ">
      
    </div>
  );
};
