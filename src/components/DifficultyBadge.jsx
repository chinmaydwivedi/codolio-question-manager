export default function DifficultyBadge({ difficulty }) {
    const level = difficulty?.toLowerCase() || 'medium';

    return (
        <span className={`difficulty-badge ${level}`}>
            {difficulty || 'Medium'}
        </span>
    );
}
