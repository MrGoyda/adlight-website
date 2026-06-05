import Skeleton from "@/components/ui/Skeleton";

export default function ServicesCatalogLoading() {
  return (
    <main className="min-h-screen bg-white font-sans pb-16">
      {/* 1. Services Hero Skeleton */}
      <section className="relative pt-36 pb-20 bg-slate-50 border-b border-slate-200 overflow-hidden">
        <div className="container mx-auto px-4 max-w-[1400px] space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-14 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </section>

      {/* 2. Services Grid Category List Skeleton */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px] space-y-16">
          {[1, 2].map((catIdx) => (
            <div key={catIdx} className="space-y-8">
              <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-slate-50 border border-slate-250/30 rounded-3xl p-6 space-y-4 shadow-2xs">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-12 w-full" />
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
