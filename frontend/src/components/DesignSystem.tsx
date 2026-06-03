export function EvidenceCard({ title, value }: { title: string, value: string }) {
    return (
        <div className="p-4 bg-zinc-800 rounded border border-zinc-700">
            <h2 className="text-lg text-zinc-400">{title}</h2>
            <p className="text-2xl mt-2">{value}</p>
        </div>
    )
}

export function VerificationBadge({ status }: { status: 'VALID' | 'TAMPERED' | 'ANCHORED' }) {
    const colors = {
        VALID: 'bg-green-600',
        TAMPERED: 'bg-red-600',
        ANCHORED: 'bg-blue-600'
    };
    return <span className={`px-2 py-1 rounded text-xs text-white ${colors[status]}`}>{status}</span>
}

export function ForensicTimeline() {
    return <div className="border-l border-zinc-700 pl-4 py-2">Timeline View</div>
}

export function AuditPanel() {
    return <div className="p-4 bg-zinc-900 border border-zinc-800 rounded">Audit Trail Panel</div>
}

export function InvestigationTable() {
    return (
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="border-b border-zinc-700">
                    <th className="py-2">Case ID</th>
                    <th className="py-2">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="py-2">case_123</td>
                    <td className="py-2">OPEN</td>
                </tr>
            </tbody>
        </table>
    )
}
