import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div className="space-y-4 text-left">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-12 w-64 md:w-96" />
                    <Skeleton className="h-4 w-48 md:w-80" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 rounded-full" />
                    <Skeleton className="h-10 w-24 rounded-full" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2rem] p-4 border border-slate-100 space-y-4">
                        <Skeleton className="aspect-square rounded-2xl" />
                        <div className="px-2 space-y-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-7 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                            <div className="flex justify-between items-center pt-4">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-12 w-12 rounded-xl" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
