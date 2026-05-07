export default function TableSkeleton({ rows = 5, columns = 6 }) {
    return (
        <div className="glass-card rounded-2xl border border-white/5 overflow-hidden animate-shimmer">
            <div className="px-5 py-4 border-b border-white/5">
                <div className="h-4 w-32 bg-white/5 rounded-lg" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-white/5">
                        <tr>
                            {Array.from({ length: columns }).map((_, i) => (
                                <th key={i} className="px-5 py-3.5">
                                    <div className="h-3 w-16 bg-white/5 rounded" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: rows }).map((_, r) => (
                            <tr key={r} className="border-b border-white/3">
                                {Array.from({ length: columns }).map((_, c) => (
                                    <td key={c} className="px-5 py-4">
                                        <div
                                            className="h-4 bg-white/5 rounded-lg"
                                            style={{ width: c === 0 ? 40 : c === 1 ? 120 : 80 }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}