import { useQuestionStore } from '../store/questionStore';

export default function Toolbar() {
    const { ui, setSearchQuery, openModal } = useQuestionStore();

    return (
        <div className="toolbar">
            <div className="search-container">
                <svg className="search-icon icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search topics or questions..."
                    value={ui.searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" onClick={() => openModal('add-topic')}>
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Topic
                </button>
            </div>
        </div>
    );
}
