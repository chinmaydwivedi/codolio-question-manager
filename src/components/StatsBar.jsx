import { useQuestionStore } from '../store/questionStore';

export default function StatsBar() {
    const { getStats } = useQuestionStore();
    const stats = getStats();

    return (
        <div className="stats-bar">
            <div className="stat-card">
                <div className="stat-label">
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Total Questions
                </div>
                <div className="stat-value">{stats.total}</div>
            </div>

            <div className="stat-card">
                <div className="stat-label">
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completed
                </div>
                <div className="stat-value accent">{stats.solved}</div>
            </div>

            <div className="stat-card">
                <div className="stat-label">
                    <span style={{ color: 'var(--easy-color)' }}>●</span> Easy
                </div>
                <div className="stat-value">
                    {stats.easy.solved}/{stats.easy.total}
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-label">
                    <span style={{ color: 'var(--medium-color)' }}>●</span> Medium
                </div>
                <div className="stat-value">
                    {stats.medium.solved}/{stats.medium.total}
                </div>
            </div>

            <div className="stat-card">
                <div className="stat-label">
                    <span style={{ color: 'var(--hard-color)' }}>●</span> Hard
                </div>
                <div className="stat-value">
                    {stats.hard.solved}/{stats.hard.total}
                </div>
            </div>
        </div>
    );
}
