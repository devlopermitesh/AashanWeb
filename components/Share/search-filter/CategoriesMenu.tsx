"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Category } from "@/payload-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface CategoriesMenuProps {
  children: React.ReactNode;
  data: Category[];
  className?: string;
}

interface ParentCategoryProps extends Category {
  onClick: () => void;
}

const ParentCategory = ({ name, color, onClick }: ParentCategoryProps) => {
  return (
    <div
      onClick={onClick}
      className="flex w-full justify-between items-center p-2 border rounded border-gray-500/30 text-black bg-opacity-5 cursor-pointer"
      style={{ backgroundColor: color ?? "#8de3c7" }}
    >
      <span>{name}</span>
      <ChevronRight className="w-5 h-5 text-neutral-700" />
    </div>
  );
};

const SideCategoriesMenu = ({
  children,
  data,
  className,
}: CategoriesMenuProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState("Categories");

  const selectedCategory = useMemo(() => {
    return data.find((cat) => cat.name === title);
  }, [title, data]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [title]);

  const handleBack = () => {
    setTitle("Categories");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent side="left" className={`bg-white ${className ?? ""}`}>
        <SheetHeader>
          <div className="flex items-center gap-2">
            {title !== "Categories" && (
              <ChevronLeft
                onClick={handleBack}
                className="w-6 h-6 hover:border hover:border-gray-300/70 rounded cursor-pointer"
              />
            )}
            <SheetTitle className="text-md sm:text-xl">{title}</SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex flex-col w-full overflow-y-auto no-scrollbar px-2 gap-2 mt-4">
          {title === "Categories" &&
            data.map((category) => (
              <ParentCategory
                key={category.id}
                {...category}
                onClick={() => setTitle(category.name)}
              />
            ))}

          {title !== "Categories" && selectedCategory && (
            <div className="flex flex-col gap-2">
              {selectedCategory.subcategories?.docs?.map((sub: any) => (
                <div
                  key={sub.id}
                  style={{
                    backgroundColor: `color-mix(in srgb, ${selectedCategory.color} 70%, white)`,
                  }}
                  className="p-2 border rounded  border-gray-300/50"
                >
                  {sub.name}
                </div>
              ))}
            </div>
          )}

          <div ref={bottomRef} className="h-6" />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideCategoriesMenu;
