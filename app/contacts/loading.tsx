import Skeleton from "@/components/ui/Skeleton";

export default function ContactsLoading() {
  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* 1. Header Skeleton */}
      <section className="relative pt-36 pb-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 space-y-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <span className="text-slate-300">/</span>
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      </section>

      {/* 2. Contacts Bento Skeleton */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
              <Skeleton className="h-44 w-full" />
            </div>
            <Skeleton className="h-full min-h-[360px]" />
          </div>
        </div>
      </section>

      {/* 3. Map Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <Skeleton className="h-[450px] w-full rounded-3xl" />
        </div>
      </section>

      {/* 4. Departments & FAQ Skeletons */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      </section>
    </main>
  );
}
