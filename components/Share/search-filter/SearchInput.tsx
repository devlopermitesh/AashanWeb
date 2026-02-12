"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/payload-types";
import { ChartNoAxesGantt, Search } from "lucide-react";
import { useState } from "react";
import SideCategoriesMenu from "./CategoriesMenu";

const SearchInput = ({ data }: { data: Category[] }) => {
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-full flex gap-2">
      {/* Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

      {/* Input */}
      <Input
        placeholder={"Search What product you are looking for..."}
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 h-10"
      />
      <SideCategoriesMenu data={data}>
        <Button
          variant={"noShadow"}
          className="flex lg:hidden bg-white border-gray-600"
        >
          <ChartNoAxesGantt className="h-8 w-8 text-primary" />
        </Button>
      </SideCategoriesMenu>
    </div>
  );
};

export default SearchInput;
