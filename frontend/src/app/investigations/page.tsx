export default function Investigations() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Investigation Workspace</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-xl">Cases & Evidence</h2>
                    <p className="mt-2 text-zinc-400">Manage case files and attached evidence.</p>
                </div>
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-xl">Notes & Reviews</h2>
                    <p className="mt-2 text-zinc-400">Collaboration, reviews, and approvals.</p>
                </div>
            </div>
        </div>
    )
}
