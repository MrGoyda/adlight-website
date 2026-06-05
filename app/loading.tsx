import Skeleton from "@/components/ui/Skeleton";

export default function HomeLoading() {
  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden pb-16">
      {/* 1. HERO SECTION SKELETON */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Skeleton className="h-12 w-44" />
                <Skeleton className="h-12 w-44" />
              </div>
            </div>
            {/* Right Images Column */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PAINS & SOLUTIONS SKELETON */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Skeleton className="h-4 w-24 mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </section>

      {/* 3. SHIMMER STATS */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4 max-w-[1400px] grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center space-y-2">
              <Skeleton className="h-10 w-20 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. SERVICES HUB TABS SKELETON */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <Skeleton className="h-8 w-80 mx-auto" />
            <Skeleton className="h-4 w-60 mx-auto" />
          </div>
          {/* Segments tabs */}
          <div className="max-w-md mx-auto mb-12">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          {/* Bento dynamic grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-[400px] w-full md:col-span-2" />
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[300px] w-full md:col-span-2" />
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO BENTO SKELETON */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-3">
              <Skeleton className="h-8 w-60" />
              <Skeleton className="h-4 w-44" />
            </div>
            <Skeleton className="h-10 w-32 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Skeleton className="h-[380px] md:col-span-4" />
            <Skeleton className="h-[380px] md:col-span-8" />
            <Skeleton className="h-[380px] md:col-span-8" />
            <Skeleton className="h-[380px] md:col-span-4" />
          </div>
        </div>
      </section>
    </main>
  );
}
