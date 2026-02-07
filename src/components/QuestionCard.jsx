import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuestionStore } from '../store/questionStore';
import DifficultyBadge from './DifficultyBadge';

export default function QuestionCard({ question }) {
    const { toggleQuestionSolved, openModal, deleteQuestion } = useQuestionStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: question.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        openModal('confirm-delete-question', { questionId: question.id, questionTitle: question.title });
    };

    // Get the problem URL - support both old and new field names
    const problemUrl = question.problemUrl || question.link || '';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`question-card ${isDragging ? 'dragging' : ''}`}
        >
            {/* Drag Handle */}
            <div className="drag-handle" {...attributes} {...listeners}>
                <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>

            {/* Checkbox */}
            <button
                className={`question-checkbox ${question.isSolved ? 'checked' : ''}`}
                onClick={() => toggleQuestionSolved(question.id)}
            >
                {question.isSolved && (
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </button>

            {/* Question Info */}
            <div className="question-info">
                <div className="question-title">
                    {problemUrl ? (
                        <a
                            href={problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                textDecoration: question.isSolved ? 'line-through' : 'none',
                                opacity: question.isSolved ? 0.6 : 1
                            }}
                        >
                            {question.title}
                        </a>
                    ) : (
                        <span style={{
                            textDecoration: question.isSolved ? 'line-through' : 'none',
                            opacity: question.isSolved ? 0.6 : 1
                        }}>
                            {question.title}
                        </span>
                    )}
                </div>
            </div>

            {/* Difficulty Badge */}
            <DifficultyBadge difficulty={question.difficulty} />

            {/* Actions */}
            <div className="topic-actions">
                <button
                    className="btn btn-ghost"
                    onClick={() => openModal('edit-question', { question })}
                    title="Edit Question"
                >
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    className="btn btn-ghost"
                    onClick={handleDelete}
                    title="Delete Question"
                >
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

