import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuestionStore } from '../store/questionStore';
import QuestionCard from './QuestionCard';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export default function SubTopicCard({ subTopic, topicId }) {
    const {
        questions,
        openModal,
        toggleQuestionSolved,
        reorderQuestions
    } = useQuestionStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: subTopic.id, data: { type: 'subtopic', topicId } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // Get questions for this sub-topic
    const subTopicQuestions = (subTopic.questionIds || [])
        .map(id => questions.byId[id])
        .filter(Boolean);

    const solvedCount = subTopicQuestions.filter(q => q.isSolved).length;
    const totalCount = subTopicQuestions.length;
    const progress = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0;

    const handleAddQuestion = (e) => {
        e.stopPropagation();
        openModal('add-question', { topicId, subTopicId: subTopic.id });
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        openModal('edit-subtopic', { subTopic, topicId });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        openModal('confirm-delete-subtopic', { subTopicId: subTopic.id, subTopicName: subTopic.name });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`subtopic-card ${isDragging ? 'dragging' : ''}`}
        >
            {/* Sub-topic Header */}
            <div className="subtopic-header">
                {/* Drag Handle */}
                <div className="drag-handle" {...attributes} {...listeners}>
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>

                {/* Sub-topic Info */}
                <div className="subtopic-info">
                    <span className="subtopic-name">{subTopic.name}</span>
                    <span className="subtopic-count">{solvedCount}/{totalCount} completed</span>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container mini">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Actions */}
                <div className="subtopic-actions">
                    <button
                        className="btn btn-ghost"
                        onClick={handleAddQuestion}
                        title="Add Question"
                    >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={handleEdit}
                        title="Edit Sub-topic"
                    >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={handleDelete}
                        title="Delete Sub-topic"
                    >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Questions under sub-topic */}
            {subTopicQuestions.length > 0 && (
                <div className="subtopic-questions">
                    <SortableContext
                        items={subTopic.questionIds || []}
                        strategy={verticalListSortingStrategy}
                    >
                        {subTopicQuestions.map(question => (
                            <QuestionCard key={question.id} question={question} />
                        ))}
                    </SortableContext>
                </div>
            )}
        </div>
    );
}
