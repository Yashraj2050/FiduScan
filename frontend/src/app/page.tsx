export default function Dashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Forensic Dashboard</h1>
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-lg font-semibold text-zinc-400">Investigations Summary</h2>
                    <p className="text-2xl mt-2">14 Active</p>
                </div>
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-lg font-semibold text-zinc-400">Evidence Summary</h2>
                    <p className="text-2xl mt-2">1,024 Items</p>
                </div>
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-lg font-semibold text-zinc-400">Verification Metrics</h2>
                    <p className="text-2xl mt-2">99.8% Success</p>
                </div>
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-lg font-semibold text-zinc-400">Watermark Metrics</h2>
                    <p className="text-2xl mt-2">4,500 Extracted</p>
                </div>
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-lg font-semibold text-zinc-400">Blockchain Metrics</h2>
                    <p className="text-2xl mt-2">890 Anchored</p>
                </div>
            </div>
        </div>
    )
}
