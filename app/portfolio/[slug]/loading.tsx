import Skeleton from "@/components/ui/Skeleton";

export default function ProjectDetailLoading() {
  return (
    <main className="min-h-screen bg-slate-50/50 font-sans pb-16">
      {/* Hero Header Section */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-20 overflow-hidden border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <Skeleton className="h-4 w-16" />
            <span className="text-slate-300">/</span>
            <Skeleton className="h-4 w-20" />
            <span className="text-slate-300">/</span>
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-16 w-3/4" />
              <div className="flex gap-4 border-b border-slate-200/50 pb-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Right Column image */}
            <div className="lg:col-span-6">
              <Skeleton className="aspect-square w-full rounded-4xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Main content sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            {/* Left body */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-28 w-full" />
              </div>
            </div>

            {/* Right details sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6">
                <Skeleton className="h-6 w-44" />
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-10 w-10 shrink-0" />
                      <div className="space-y-2 w-full">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
