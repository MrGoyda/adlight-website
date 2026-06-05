import Skeleton from "@/components/ui/Skeleton";

export default function VolumeLettersLoading() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* 1. Hero Section Skeleton */}
      <section className="relative pt-36 pb-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-14 w-3/4" />
              <Skeleton className="h-12 w-5/6" />
              <div className="flex gap-4">
                <Skeleton className="h-12 w-44" />
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Psychology Section Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-16 w-full" />
          </div>
          <Skeleton className="aspect-video w-full rounded-3xl" />
        </div>
      </section>

      {/* 3. TechCatalogGrid Skeleton */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-[1400px] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-44 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
                <Skeleton className="h-44 w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
