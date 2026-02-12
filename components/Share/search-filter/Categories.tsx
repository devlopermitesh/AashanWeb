"use client";

import { useEffect, useRef, useState } from "react";
import { ChartNoAxesGantt } from "lucide-react";
import { Category } from "@/payload-types";
import CategoryItem from "./CategoryItem";
import { cn } from "@/lib/utils";
import CategoriesMenu from "./CategoriesMenu";
import SideCategoriesMenu from "./CategoriesMenu";

interface CategoriesProps {
  data: Category[];
}

const CATEGORY_GAP = 20; // Configurable gap between categories

const AllCategory: Category = {
  id: "all",
  name: "All",
  slug: "all",
  color: "#ffffff",
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  subcategories: {
    docs: [],
  },
};

const Categories = ({ data }: CategoriesProps) => {
  const activeCategory = "all";

  // Refs for measuring and container elements
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const viewAllButtonRef = useRef<HTMLDivElement | null>(null);

  // State management
  const [visibleCount, setVisibleCount] = useState(data.length);
  const [isContainerHovered, setIsContainerHovered] = useState(false);

  // Find the active category index
  const activeCategoryIndex = data.findIndex(
    (category) => category.slug === activeCategory,
  );

  // Check if active category is hidden
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calculateVisibleCategories = () => {
      if (
        !containerRef.current ||
        !measureRef.current ||
        !viewAllButtonRef.current
      ) {
        return;
      }

      const containerWidth = containerRef.current.getBoundingClientRect().width;
      const viewAllButtonWidth =
        viewAllButtonRef.current.getBoundingClientRect().width;

      // Calculate available width for categories
      const availableWidth = containerWidth - viewAllButtonWidth;

      const categoryElements = Array.from(
        measureRef.current.children,
      ) as HTMLElement[];
      let accumulatedWidth = 0;
      let visibleCategoriesCount = 0;

      for (const element of categoryElements) {
        const elementWidth = element.getBoundingClientRect().width;
        const requiredWidth = accumulatedWidth + elementWidth;

        // Check if adding this element exceeds available width
        if (requiredWidth > availableWidth) {
          break;
        }

        accumulatedWidth = requiredWidth + CATEGORY_GAP;
        visibleCategoriesCount++;
      }

      setVisibleCount(visibleCategoriesCount);
    };

    // Use ResizeObserver for responsive behavior
    const resizeObserver = new ResizeObserver(calculateVisibleCategories);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Initial calculation
    calculateVisibleCategories();

    return () => {
      resizeObserver.disconnect();
    };
  }, [data.length]);

  return (
    <div className="relative w-full hidden lg:block ">
      {/* Measurement container (hidden) - used to calculate category widths */}
      <div
        ref={measureRef}
        className="pointer-events-none fixed -top-[9999px] -left-[9999px] flex items-center opacity-0"
        style={{ gap: `${CATEGORY_GAP}px` }}
        aria-hidden="true"
      >
        <CategoryItem
          key="all-measure"
          category={AllCategory}
          ActiveCategory={activeCategory}
        />
        {data.map((category) => (
          <CategoryItem
            key={`${category.id}-measure`}
            category={category}
            ActiveCategory={activeCategory}
          />
        ))}
      </div>

      {/* Visible categories container */}
      <div
        ref={containerRef}
        className="flex items-center w-full"
        style={{ gap: `${CATEGORY_GAP}px` }}
        onMouseEnter={() => setIsContainerHovered(true)}
        onMouseLeave={() => setIsContainerHovered(false)}
      >
        {/* "All" category - always visible */}
        <CategoryItem
          key="all-visible"
          category={AllCategory}
          ActiveCategory={activeCategory}
        />

        {/* Dynamically visible categories */}
        {data.slice(0, visibleCount).map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            ActiveCategory={activeCategory}
          />
        ))}

        {/* View All button - positioned at the end */}
        <SideCategoriesMenu data={data}>
          <div ref={viewAllButtonRef} className="ml-auto shrink-0">
            <button
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md border border-transparent transition-all duration-200",
                "hover:bg-white hover:border-primary",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                isActiveCategoryHidden &&
                  !isContainerHovered &&
                  "bg-white border-primary",
              )}
              aria-label="View all categories"
            >
              <span className="text-sm font-medium">View All</span>
              <ChartNoAxesGantt className="h-4 w-4 text-primary" />
            </button>
          </div>
        </SideCategoriesMenu>
      </div>
    </div>
  );
};

export default Categories;
