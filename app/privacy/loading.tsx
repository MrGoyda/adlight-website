import Skeleton from "@/components/ui/Skeleton";

export default function PrivacyLoading() {
  return (
    <main className="min-h-screen bg-white font-sans py-20">
      <div className="container mx-auto px-4 max-w-3xl space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="space-y-6 pt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
