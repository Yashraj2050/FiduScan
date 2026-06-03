export default function Evidence() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Evidence Vault</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-xl">Authenticity & Watermarks</h2>
                    <p className="mt-2 text-zinc-400">View forensic analysis and embedded payload status.</p>
                </div>
                <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
                    <h2 className="text-xl">Chain of Custody</h2>
                    <p className="mt-2 text-zinc-400">Blockchain verification and immutable audit trails.</p>
                </div>
            </div>
        </div>
    )
}
