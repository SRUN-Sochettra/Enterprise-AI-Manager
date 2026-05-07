export default function CardSkeleton() {
    return (
        <div className="glass-card rounded-2xl border border-white/5 p-5 space-y-4 animate-shimmer">
            <div className="flex items-start justify-between">
                <div className="w-10 h-10 bg-white/5 rounded-xl" />
                <div className="h-5 w-16 bg-white/3 rounded-full" />
            </div>
            <div className="space-y-2">
                <div className="h-7 w-24 bg-white/5 rounded-lg" />
                <div className="h-3 w-36 bg-white/3 rounded-lg" />
            </div>
        </div>
    );
}