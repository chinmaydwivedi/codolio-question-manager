import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQuestionStore } from '../store/questionStore';
import QuestionCard from './QuestionCard';
import SubTopicCard from './SubTopicCard';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function TopicCard({ topic }) {
    const {
        ui,
        subTopics,
        toggleTopic,
        getTopicProgress,
        getQuestionsForTopic,
        openModal,
        deleteTopic,
        reorderQuestions,
        reorderSubTopics
    } = useQuestionStore();

    const isExpanded = ui.expandedTopics.includes(topic.id);
    const progress = getTopicProgress(topic.id);
    const questions = getQuestionsForTopic(topic.id);

    // Track if topic is 100% completed
    const isCompleted = progress.total > 0 && progress.solved === progress.total;
    const prevCompletedRef = useRef(isCompleted);

    // Trigger confetti when topic becomes completed
    useEffect(() => {
        if (isCompleted && !prevCompletedRef.current && progress.total > 0) {
            // 🎉 Fire confetti celebration!
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#22c55e', '#4ade80', '#86efac', '#fbbf24', '#f59e0b']
            });
        }
        prevCompletedRef.current = isCompleted;
    }, [isCompleted, progress.total]);

    // Get sub-topics for this topic
    const topicSubTopics = (topic.subTopicIds || [])
        .map(id => subTopics.byId[id])
        .filter(Boolean);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: topic.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            // Check if dragging sub-topic or question
            if (active.data?.current?.type === 'subtopic') {
                reorderSubTopics(topic.id, active.id, over.id);
            } else {
                reorderQuestions(topic.id, active.id, over.id);
            }
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        e.preventDefault();
        openModal('confirm-delete-topic', { topicId: topic.id, topicName: topic.name });
    };

    const handleAddSubTopic = (e) => {
        e.stopPropagation();
        openModal('add-subtopic', { topicId: topic.id });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`topic-card ${isDragging ? 'dragging' : ''} ${isCompleted ? 'completed' : ''}`}
        >
            <div className="topic-header" onClick={() => toggleTopic(topic.id)}>
                {/* Drag Handle */}
                <div className="drag-handle" {...attributes} {...listeners}>
                    <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                </div>

                {/* Expand Icon */}
                <svg
                    className={`icon topic-expand-icon ${isExpanded ? 'expanded' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>

                {/* Topic Info */}
                <div className="topic-info">
                    <div className="topic-name">{topic.name}</div>
                    <div className="topic-meta">
                        {progress.solved}/{progress.total} questions completed
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="topic-progress">
                    <div
                        className="topic-progress-bar"
                        style={{ width: `${progress.percent}%` }}
                    />
                </div>

                {/* Actions */}
                <div className="topic-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => openModal('add-question', { topicId: topic.id })}
                        title="Add Question"
                    >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={handleAddSubTopic}
                        title="Add Sub-topic"
                    >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                        </svg>
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={() => openModal('edit-topic', { topic })}
                        title="Edit Topic"
                    >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        className="btn btn-ghost"
                        onClick={handleDelete}
                        title="Delete Topic"
                    >
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content: Sub-topics and Questions */}
            {isExpanded && (
                <div className="topic-content">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        {/* Sub-topics */}
                        {topicSubTopics.length > 0 && (
                            <div className="subtopics-list">
                                <SortableContext
                                    items={topic.subTopicIds || []}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {topicSubTopics.map((subTopic) => (
                                        <SubTopicCard
                                            key={subTopic.id}
                                            subTopic={subTopic}
                                            topicId={topic.id}
                                        />
                                    ))}
                                </SortableContext>
                            </div>
                        )}

                        {/* Questions directly under topic (not in sub-topic) */}
                        {questions.length > 0 && (
                            <SortableContext
                                items={questions.map(q => q.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="questions-list">
                                    {questions.map((question) => (
                                        <QuestionCard key={question.id} question={question} />
                                    ))}
                                </div>
                            </SortableContext>
                        )}

                        {/* Empty state */}
                        {questions.length === 0 && topicSubTopics.length === 0 && (
                            <div className="empty-state" style={{ padding: '30px 20px' }}>
                                <div className="empty-state-description">
                                    No questions yet. Click + to add questions or sub-topics.
                                </div>
                            </div>
                        )}
                    </DndContext>
                </div>
            )}
        </div>
    );
}
