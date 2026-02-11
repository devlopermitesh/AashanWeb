import { cn } from "@/lib/utils";

export function GridstyleWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full w-full  items-center justify-center  ">
      {/* Grid background — anchored to THIS wrapper */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)]"
        )}
      />
      {/* Content sits above the grid */}
      <div className="relative z-10 ">
        {children}
      </div>
    </div>
  );
}