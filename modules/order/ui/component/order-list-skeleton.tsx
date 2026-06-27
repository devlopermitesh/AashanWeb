export const OrderListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-base border-2 border-border bg-secondary-background p-5 shadow-shadow"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="h-4 w-36 rounded-base bg-foreground/10" />
            <div className="h-6 w-20 rounded-base bg-foreground/10" />
          </div>
          <div className="mt-4 flex gap-4">
            <div className="h-16 w-16 rounded-base bg-foreground/10" />
            <div className="flex-1">
              <div className="h-4 w-48 rounded-base bg-foreground/10" />
              <div className="mt-2 h-3 w-40 rounded-base bg-foreground/10" />
              <div className="mt-2 h-3 w-56 rounded-base bg-foreground/10" />
            </div>
            <div className="h-10 w-20 rounded-base bg-foreground/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
