import Skeleton from "@/components/ui/Skeleton";

export default function PortfolioLoading() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans pt-32 pb-16">
      <div className="container mx-auto px-4 max-w-[1400px] space-y-8">
        {/* Header Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-5/6" />
        </div>

        {/* Filter Tabs Skeleton */}
        <div className="flex flex-wrap gap-3 py-4 border-y border-slate-200">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-10 w-28 rounded-xl" />
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm space-y-4 pb-6">
              <Skeleton className="h-64 w-full rounded-t-3xl rounded-b-none" />
              <div className="px-6 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center gap-2 pt-12">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </main>
  );
}
