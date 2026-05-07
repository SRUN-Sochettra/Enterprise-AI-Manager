export default function HeaderSkeleton() {
    return (
        <div className="flex items-center justify-between animate-shimmer">
            <div className="space-y-2">
                <div className="h-7 w-52 bg-white/5 rounded-xl" />
                <div className="h-4 w-36 bg-white/3 rounded-lg" />
            </div>
            <div className="flex gap-2">
                <div className="h-6 w-20 bg-white/5 rounded-full" />
                <div className="h-6 w-16 bg-white/5 rounded-full" />
            </div>
        </div>
    );
}