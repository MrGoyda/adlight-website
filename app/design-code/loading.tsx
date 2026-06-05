import Skeleton from "@/components/ui/Skeleton";

export default function DesignCodeLoading() {
  return (
    <main className="min-h-screen bg-white font-sans overflow-x-hidden pb-16">
      {/* 1. HERO SECTION SKELETON */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-12 w-5/6" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-44" />
              </div>
            </div>
            <div className="lg:col-span-5">
              <Skeleton className="h-[320px] w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. WAYS SECTION SKELETON */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Skeleton className="h-8 w-80 mx-auto" />
            <Skeleton className="h-4 w-60 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      </section>

      {/* 3. RULES & BANS SKELETON */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEES SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-[1400px] space-y-8">
          <Skeleton className="h-10 w-96 mx-auto" />
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
