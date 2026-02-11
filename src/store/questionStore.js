import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { fetchSheetBySlug } from '../api/questionApi';
import sampleData from '../data/sampleData';


export const useQuestionStore = create(
    persist(
        (set, get) => ({
            ...sampleData,
            ui: {
                expandedTopics: [],
                searchQuery: '',
                editingItem: null,
                modal: null, // { type: 'add-topic' | 'edit-topic' | 'add-question' | 'edit-question', data: {} }
            },
            // API states
            isLoading: false,
            error: null,
            sheetInfo: null,
            dataSource: 'sample', // 'sample' | 'api'


            // ============================================
            // API ACTIONS
            // ============================================
            fetchFromApi: async () => {
                set({ isLoading: true, error: null });
                try {
                    const apiData = await fetchSheetBySlug('striver-sde-sheet');

                    // Get current state to preserve user progress (isSolved status)
                    const currentState = get();

                    // Merge API data with preserved user progress
                    const mergedQuestions = { ...apiData.questions.byId };
                    for (const [id, question] of Object.entries(mergedQuestions)) {
                        if (currentState.questions.byId[id]) {
                            // Preserve user's solved status
                            mergedQuestions[id] = {
                                ...question,
                                isSolved: currentState.questions.byId[id].isSolved || false
                            };
                        }
                    }

                    // Also preserve any custom topics/questions the user created
                    const customTopics = Object.entries(currentState.topics.byId)
                        .filter(([id]) => id.startsWith('custom-'));
                    const customQuestions = Object.entries(currentState.questions.byId)
                        .filter(([id]) => id.startsWith('custom-q-'));

                    customTopics.forEach(([id, topic]) => {
                        apiData.topics.byId[id] = topic;
                        if (!apiData.topics.allIds.includes(id)) {
                            apiData.topics.allIds.push(id);
                        }
                    });

                    customQuestions.forEach(([id, question]) => {
                        mergedQuestions[id] = question;
                        if (!apiData.questions.allIds.includes(id)) {
                            apiData.questions.allIds.push(id);
                        }
                    });

                    set({
                        topics: {
                            byId: apiData.topics.byId,
                            allIds: apiData.topics.allIds
                        },
                        questions: {
                            byId: mergedQuestions,
                            allIds: apiData.questions.allIds
                        },
                        sheetInfo: apiData.sheetInfo,
                        isLoading: false,
                        dataSource: 'api'
                    });

                    return true;
                } catch (error) {
                    console.error('Failed to fetch from API:', error);
                    set({
                        isLoading: false,
                        error: error.message || 'Failed to fetch data from API'
                    });
                    return false;
                }
            },

            clearError: () => set({ error: null }),

            // ============================================
            // COMPUTED VALUES
            // ============================================
            getStats: () => {
                const state = get();
                const questions = Object.values(state.questions.byId);
                const solved = questions.filter(q => q.isSolved).length;
                const total = questions.length;
                const easy = questions.filter(q => q.difficulty === 'Easy');
                const medium = questions.filter(q => q.difficulty === 'Medium');
                const hard = questions.filter(q => q.difficulty === 'Hard');

                return {
                    total,
                    solved,
                    progress: total > 0 ? Math.round((solved / total) * 100) : 0,
                    easy: { total: easy.length, solved: easy.filter(q => q.isSolved).length },
                    medium: { total: medium.length, solved: medium.filter(q => q.isSolved).length },
                    hard: { total: hard.length, solved: hard.filter(q => q.isSolved).length },
                };
            },

            getTopicProgress: (topicId) => {
                const state = get();
                const topic = state.topics.byId[topicId];
                if (!topic) return { solved: 0, total: 0, percent: 0 };

                const questions = topic.questionIds.map(id => state.questions.byId[id]).filter(Boolean);
                const solved = questions.filter(q => q.isSolved).length;
                const total = questions.length;

                return {
                    solved,
                    total,
                    percent: total > 0 ? Math.round((solved / total) * 100) : 0
                };
            },

            getFilteredTopics: () => {
                const state = get();
                const query = state.ui.searchQuery.toLowerCase();

                if (!query) {
                    return state.topics.allIds.map(id => state.topics.byId[id]);
                }

                return state.topics.allIds
                    .map(id => state.topics.byId[id])
                    .filter(topic => {
                        // Match topic name
                        if (topic.name.toLowerCase().includes(query)) return true;
                        // Match any question in topic
                        return topic.questionIds.some(qId => {
                            const q = state.questions.byId[qId];
                            return q && q.title.toLowerCase().includes(query);
                        });
                    });
            },

            getQuestionsForTopic: (topicId) => {
                const state = get();
                const topic = state.topics.byId[topicId];
                if (!topic) return [];

                const query = state.ui.searchQuery.toLowerCase();

                return topic.questionIds
                    .map(id => state.questions.byId[id])
                    .filter(q => {
                        if (!q) return false;
                        if (!query) return true;
                        return q.title.toLowerCase().includes(query);
                    });
            },

            // ============================================
            // UI ACTIONS
            // ============================================
            toggleTopic: (topicId) => set((state) => ({
                ui: {
                    ...state.ui,
                    expandedTopics: state.ui.expandedTopics.includes(topicId)
                        ? state.ui.expandedTopics.filter(id => id !== topicId)
                        : [...state.ui.expandedTopics, topicId]
                }
            })),

            setSearchQuery: (query) => set((state) => ({
                ui: { ...state.ui, searchQuery: query }
            })),

            openModal: (type, data = {}) => set((state) => ({
                ui: { ...state.ui, modal: { type, data } }
            })),

            closeModal: () => set((state) => ({
                ui: { ...state.ui, modal: null }
            })),

            // ============================================
            // TOPIC ACTIONS
            // ============================================
            addTopic: (name) => set((state) => {
                const id = uuidv4();
                return {
                    topics: {
                        byId: {
                            ...state.topics.byId,
                            [id]: { id, name, order: state.topics.allIds.length, questionIds: [] }
                        },
                        allIds: [...state.topics.allIds, id]
                    }
                };
            }),

            updateTopic: (id, updates) => set((state) => ({
                topics: {
                    ...state.topics,
                    byId: {
                        ...state.topics.byId,
                        [id]: { ...state.topics.byId[id], ...updates }
                    }
                }
            })),

            deleteTopic: (id) => set((state) => {
                const topic = state.topics.byId[id];
                const { [id]: removed, ...remainingTopics } = state.topics.byId;

                // Also remove all questions in this topic
                const questionsToRemove = topic?.questionIds || [];
                const remainingQuestions = { ...state.questions.byId };
                questionsToRemove.forEach(qId => delete remainingQuestions[qId]);

                return {
                    topics: {
                        byId: remainingTopics,
                        allIds: state.topics.allIds.filter(topicId => topicId !== id)
                    },
                    questions: {
                        byId: remainingQuestions,
                        allIds: state.questions.allIds.filter(qId => !questionsToRemove.includes(qId))
                    }
                };
            }),

            reorderTopics: (activeId, overId) => set((state) => {
                const oldIndex = state.topics.allIds.indexOf(activeId);
                const newIndex = state.topics.allIds.indexOf(overId);

                if (oldIndex === -1 || newIndex === -1) return state;

                const newAllIds = [...state.topics.allIds];
                newAllIds.splice(oldIndex, 1);
                newAllIds.splice(newIndex, 0, activeId);

                return {
                    topics: {
                        ...state.topics,
                        allIds: newAllIds
                    }
                };
            }),

            // ============================================
            // SUB-TOPIC ACTIONS
            // ============================================
            addSubTopic: (topicId, name) => set((state) => {
                const id = uuidv4();
                const topic = state.topics.byId[topicId];
                if (!topic) return state;

                return {
                    subTopics: {
                        byId: {
                            ...state.subTopics.byId,
                            [id]: { id, name, topicId, order: topic.subTopicIds?.length || 0, questionIds: [] }
                        },
                        allIds: [...state.subTopics.allIds, id]
                    },
                    topics: {
                        ...state.topics,
                        byId: {
                            ...state.topics.byId,
                            [topicId]: {
                                ...topic,
                                subTopicIds: [...(topic.subTopicIds || []), id]
                            }
                        }
                    }
                };
            }),

            updateSubTopic: (id, updates) => set((state) => ({
                subTopics: {
                    ...state.subTopics,
                    byId: {
                        ...state.subTopics.byId,
                        [id]: { ...state.subTopics.byId[id], ...updates }
                    }
                }
            })),

            deleteSubTopic: (id) => set((state) => {
                const subTopic = state.subTopics.byId[id];
                if (!subTopic) return state;

                const { [id]: removed, ...remainingSubTopics } = state.subTopics.byId;
                const topic = state.topics.byId[subTopic.topicId];

                // Move questions from sub-topic back to parent topic
                const questionsToMove = subTopic.questionIds || [];
                const updatedTopic = topic ? {
                    ...topic,
                    subTopicIds: (topic.subTopicIds || []).filter(stId => stId !== id),
                    questionIds: [...(topic.questionIds || []), ...questionsToMove]
                } : topic;

                // Update questions to remove subTopicId
                const updatedQuestions = { ...state.questions.byId };
                questionsToMove.forEach(qId => {
                    if (updatedQuestions[qId]) {
                        updatedQuestions[qId] = { ...updatedQuestions[qId], subTopicId: null };
                    }
                });

                return {
                    subTopics: {
                        byId: remainingSubTopics,
                        allIds: state.subTopics.allIds.filter(stId => stId !== id)
                    },
                    topics: topic ? {
                        ...state.topics,
                        byId: {
                            ...state.topics.byId,
                            [subTopic.topicId]: updatedTopic
                        }
                    } : state.topics,
                    questions: {
                        ...state.questions,
                        byId: updatedQuestions
                    }
                };
            }),

            reorderSubTopics: (topicId, activeId, overId) => set((state) => {
                const topic = state.topics.byId[topicId];
                if (!topic || !topic.subTopicIds) return state;

                const oldIndex = topic.subTopicIds.indexOf(activeId);
                const newIndex = topic.subTopicIds.indexOf(overId);

                if (oldIndex === -1 || newIndex === -1) return state;

                const newSubTopicIds = [...topic.subTopicIds];
                newSubTopicIds.splice(oldIndex, 1);
                newSubTopicIds.splice(newIndex, 0, activeId);

                return {
                    topics: {
                        ...state.topics,
                        byId: {
                            ...state.topics.byId,
                            [topicId]: { ...topic, subTopicIds: newSubTopicIds }
                        }
                    }
                };
            }),

            // Get sub-topics for a topic
            getSubTopicsForTopic: (topicId) => {
                const state = get();
                const topic = state.topics.byId[topicId];
                if (!topic || !topic.subTopicIds) return [];
                return topic.subTopicIds
                    .map(id => state.subTopics.byId[id])
                    .filter(Boolean);
            },

            // ============================================
            // QUESTION ACTIONS
            // ============================================
            addQuestion: (topicId, questionData) => set((state) => {
                const id = uuidv4();
                const topic = state.topics.byId[topicId];
                if (!topic) return state;

                const subTopicId = questionData.subTopicId;

                // If subTopicId is provided, add to sub-topic instead of topic
                if (subTopicId && state.subTopics.byId[subTopicId]) {
                    const subTopic = state.subTopics.byId[subTopicId];
                    return {
                        questions: {
                            byId: {
                                ...state.questions.byId,
                                [id]: { id, topicId, subTopicId, isSolved: false, ...questionData }
                            },
                            allIds: [...state.questions.allIds, id]
                        },
                        subTopics: {
                            ...state.subTopics,
                            byId: {
                                ...state.subTopics.byId,
                                [subTopicId]: {
                                    ...subTopic,
                                    questionIds: [...(subTopic.questionIds || []), id]
                                }
                            }
                        }
                    };
                }

                // Otherwise, add to topic directly
                return {
                    questions: {
                        byId: {
                            ...state.questions.byId,
                            [id]: { id, topicId, isSolved: false, ...questionData }
                        },
                        allIds: [...state.questions.allIds, id]
                    },
                    topics: {
                        ...state.topics,
                        byId: {
                            ...state.topics.byId,
                            [topicId]: {
                                ...topic,
                                questionIds: [...topic.questionIds, id]
                            }
                        }
                    }
                };
            }),

            updateQuestion: (id, updates) => set((state) => ({
                questions: {
                    ...state.questions,
                    byId: {
                        ...state.questions.byId,
                        [id]: { ...state.questions.byId[id], ...updates }
                    }
                }
            })),

            toggleQuestionSolved: (id) => set((state) => ({
                questions: {
                    ...state.questions,
                    byId: {
                        ...state.questions.byId,
                        [id]: {
                            ...state.questions.byId[id],
                            isSolved: !state.questions.byId[id].isSolved
                        }
                    }
                }
            })),

            deleteQuestion: (id) => set((state) => {
                const question = state.questions.byId[id];
                if (!question) return state;

                const { [id]: removed, ...remainingQuestions } = state.questions.byId;
                const topic = state.topics.byId[question.topicId];

                return {
                    questions: {
                        byId: remainingQuestions,
                        allIds: state.questions.allIds.filter(qId => qId !== id)
                    },
                    topics: topic ? {
                        ...state.topics,
                        byId: {
                            ...state.topics.byId,
                            [question.topicId]: {
                                ...topic,
                                questionIds: topic.questionIds.filter(qId => qId !== id)
                            }
                        }
                    } : state.topics
                };
            }),

            reorderQuestions: (topicId, activeId, overId) => set((state) => {
                const topic = state.topics.byId[topicId];
                if (!topic) return state;

                const oldIndex = topic.questionIds.indexOf(activeId);
                const newIndex = topic.questionIds.indexOf(overId);

                if (oldIndex === -1 || newIndex === -1) return state;

                const newQuestionIds = [...topic.questionIds];
                newQuestionIds.splice(oldIndex, 1);
                newQuestionIds.splice(newIndex, 0, activeId);

                return {
                    topics: {
                        ...state.topics,
                        byId: {
                            ...state.topics.byId,
                            [topicId]: {
                                ...topic,
                                questionIds: newQuestionIds
                            }
                        }
                    }
                };
            }),
        }),
        {
            name: 'question-manager-v3',
            partialize: (state) => ({
                topics: state.topics,
                questions: state.questions,
                ui: { expandedTopics: state.ui.expandedTopics }
            }),
            merge: (persistedState, currentState) => {
                // Merge persisted state with current state, ensuring UI defaults are preserved
                return {
                    ...currentState,
                    ...persistedState,
                    ui: {
                        ...currentState.ui,
                        ...(persistedState?.ui || {}),
                        searchQuery: '', // Always reset search on refresh
                        modal: null, // Always reset modal on refresh
                    }
                };
            },
        }
    )
);
