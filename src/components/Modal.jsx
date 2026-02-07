import { useState, useEffect } from 'react';
import { useQuestionStore } from '../store/questionStore';

export default function Modal() {
    const {
        ui,
        closeModal,
        addTopic,
        updateTopic,
        addQuestion,
        updateQuestion,
        deleteTopic,
        deleteQuestion,
        addSubTopic,
        updateSubTopic,
        deleteSubTopic
    } = useQuestionStore();
    const { type, data } = ui.modal || {};

    // Form state
    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Initialize form based on modal type
        if (type === 'edit-topic' && data?.topic) {
            setFormData({ name: data.topic.name });
        } else if (type === 'edit-subtopic' && data?.subTopic) {
            setFormData({ name: data.subTopic.name });
        } else if (type === 'edit-question' && data?.question) {
            setFormData({ ...data.question });
        } else if (type === 'add-question' && data?.topicId) {
            setFormData({
                title: '',
                difficulty: 'Medium',
                platform: 'leetcode',
                problemUrl: '',
                topicId: data.topicId,
                subTopicId: data.subTopicId || null
            });
        } else if (type === 'add-subtopic' && data?.topicId) {
            setFormData({ name: '', topicId: data.topicId });
        } else {
            setFormData({ name: '' });
        }
    }, [type, data]);

    const handleSubmit = (e) => {
        e.preventDefault();

        switch (type) {
            case 'add-topic':
                if (formData.name?.trim()) {
                    addTopic(formData.name.trim());
                }
                break;
            case 'edit-topic':
                if (formData.name?.trim() && data?.topic) {
                    updateTopic(data.topic.id, { name: formData.name.trim() });
                }
                break;
            case 'add-subtopic':
                if (formData.name?.trim() && data?.topicId) {
                    addSubTopic(data.topicId, formData.name.trim());
                }
                break;
            case 'edit-subtopic':
                if (formData.name?.trim() && data?.subTopic) {
                    updateSubTopic(data.subTopic.id, { name: formData.name.trim() });
                }
                break;
            case 'add-question':
                if (formData.title?.trim() && formData.topicId) {
                    addQuestion(formData.topicId, {
                        title: formData.title.trim(),
                        difficulty: formData.difficulty || 'Medium',
                        platform: formData.platform || 'leetcode',
                        problemUrl: formData.problemUrl || '#',
                        subTopicId: formData.subTopicId || null
                    });
                }
                break;
            case 'edit-question':
                if (formData.title?.trim() && data?.question) {
                    updateQuestion(data.question.id, {
                        title: formData.title.trim(),
                        difficulty: formData.difficulty,
                        platform: formData.platform,
                        problemUrl: formData.problemUrl
                    });
                }
                break;
        }

        closeModal();
    };

    const handleConfirmDelete = () => {
        if (type === 'confirm-delete-topic' && data?.topicId) {
            deleteTopic(data.topicId);
        } else if (type === 'confirm-delete-question' && data?.questionId) {
            deleteQuestion(data.questionId);
        } else if (type === 'confirm-delete-subtopic' && data?.subTopicId) {
            deleteSubTopic(data.subTopicId);
        }
        closeModal();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const getTitle = () => {
        switch (type) {
            case 'add-topic': return 'Add New Topic';
            case 'edit-topic': return 'Edit Topic';
            case 'add-subtopic': return 'Add Sub-topic';
            case 'edit-subtopic': return 'Edit Sub-topic';
            case 'add-question': return 'Add New Question';
            case 'edit-question': return 'Edit Question';
            case 'confirm-delete-topic': return 'Delete Topic';
            case 'confirm-delete-subtopic': return 'Delete Sub-topic';
            case 'confirm-delete-question': return 'Delete Question';
            default: return 'Modal';
        }
    };

    const isSubTopicForm = type === 'add-subtopic' || type === 'edit-subtopic';
    const isQuestionForm = type === 'add-question' || type === 'edit-question';
    const isTopicForm = type === 'add-topic' || type === 'edit-topic';
    const isConfirmDelete = type === 'confirm-delete-topic' || type === 'confirm-delete-question' || type === 'confirm-delete-subtopic';

    return (
        <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">{getTitle()}</h2>
                    <button className="btn btn-ghost" onClick={closeModal}>
                        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {isConfirmDelete ? (
                    // Confirmation Delete Dialog
                    <>
                        <div className="modal-body">
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                {type === 'confirm-delete-topic' ? (
                                    <>Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{data?.topicName}"</strong> and all its questions? This action cannot be undone.</>
                                ) : type === 'confirm-delete-subtopic' ? (
                                    <>Are you sure you want to delete sub-topic <strong style={{ color: 'var(--text-primary)' }}>"{data?.subTopicName}"</strong>? Its questions will be moved to the parent topic.</>
                                ) : (
                                    <>Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{data?.questionTitle}"</strong>? This action cannot be undone.</>
                                )}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
                                Delete
                            </button>
                        </div>
                    </>
                ) : (
                    // Regular Form
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {(isTopicForm || isSubTopicForm) ? (
                                // Topic/Sub-topic Form
                                <div className="form-group">
                                    <label className="form-label">{isSubTopicForm ? 'Sub-topic Name' : 'Topic Name'}</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder={isSubTopicForm ? "e.g., Basic Problems" : "e.g., Dynamic Programming"}
                                        value={formData.name || ''}
                                        onChange={(e) => handleChange('name', e.target.value)}
                                        autoFocus
                                        required
                                    />
                                </div>
                            ) : isQuestionForm && (
                                // Question Form
                                <>
                                    <div className="form-group">
                                        <label className="form-label">Question Title</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="e.g., Two Sum"
                                            value={formData.title || ''}
                                            onChange={(e) => handleChange('title', e.target.value)}
                                            autoFocus
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Difficulty</label>
                                        <select
                                            className="form-select"
                                            value={formData.difficulty || 'Medium'}
                                            onChange={(e) => handleChange('difficulty', e.target.value)}
                                        >
                                            <option value="Easy">Easy</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Hard">Hard</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Platform</label>
                                        <select
                                            className="form-select"
                                            value={formData.platform || 'leetcode'}
                                            onChange={(e) => handleChange('platform', e.target.value)}
                                        >
                                            <option value="leetcode">LeetCode</option>
                                            <option value="gfg">GeeksforGeeks</option>
                                            <option value="interviewbit">InterviewBit</option>
                                            <option value="codeforces">Codeforces</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Problem URL</label>
                                        <input
                                            type="url"
                                            className="form-input"
                                            placeholder="https://leetcode.com/problems/..."
                                            value={formData.problemUrl || ''}
                                            onChange={(e) => handleChange('problemUrl', e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {type?.startsWith('add') ? 'Add' : 'Save'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
