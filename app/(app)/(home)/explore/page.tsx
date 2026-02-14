import SearchFilter from "@/components/Share/search-filter";
import { getQueryClient, trpc } from "@/trpc/server";

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.category.getMany.queryOptions());
  return (
    <div className="flex flex-col h-auto lg:h-32 bg-white w-full ">
      <SearchFilter />
    </div>
  );
}
