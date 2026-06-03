export default function Reports() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Reports Workspace</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-xl">Authenticity Reports</h2>
                    <p className="mt-2 text-zinc-400">View and download forensic JSON and PDF reports.</p>
                </div>
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-xl">Evidence Exports</h2>
                    <p className="mt-2 text-zinc-400">Download complete zipped evidence bundles.</p>
                </div>
            </div>
        </div>
    )
}
