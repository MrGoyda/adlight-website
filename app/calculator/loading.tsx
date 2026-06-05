import Skeleton from "@/components/ui/Skeleton";

export default function CalculatorLoading() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-10 md:py-14 text-center max-w-2xl space-y-3">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-5/6 mx-auto" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 pb-32 lg:pb-12 max-w-[1400px] space-y-12">
        {/* CalculatorShell Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: configurations */}
          <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-sm">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-12 w-1/2" />
            </div>
            <Skeleton className="h-40 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          </div>

          {/* Right panel: summary */}
          <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 space-y-6 shadow-sm">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>

        {/* PriceShowcase Skeleton */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 space-y-6">
          <Skeleton className="h-8 w-44" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
