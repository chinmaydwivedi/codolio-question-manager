import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { fetchSheetBySlug } from '../api/questionApi';

// Sample data from Striver SDE Sheet API
const sampleData = {
    topics: {
        byId: {
            'arrays': { id: 'arrays', name: 'Arrays', order: 0, subTopicIds: [], questionIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] },
            'arrays-2': { id: 'arrays-2', name: 'Arrays Part-II', order: 1, subTopicIds: [], questionIds: ['q7', 'q8', 'q9', 'q10', 'q11'] },
            'arrays-3': { id: 'arrays-3', name: 'Arrays Part-III', order: 2, subTopicIds: [], questionIds: ['q12', 'q13', 'q14', 'q15', 'q16', 'q17'] },
            'linked-list': { id: 'linked-list', name: 'Linked List', order: 3, subTopicIds: [], questionIds: ['q18', 'q19', 'q20', 'q21', 'q22', 'q23'] },
            'linked-list-2': { id: 'linked-list-2', name: 'Linked List Part-II', order: 4, subTopicIds: [], questionIds: ['q24', 'q25', 'q26', 'q27', 'q28', 'q29'] },
            'greedy': { id: 'greedy', name: 'Greedy Algorithm', order: 5, subTopicIds: [], questionIds: ['q30', 'q31', 'q32', 'q33', 'q34', 'q35'] },
            'recursion': { id: 'recursion', name: 'Recursion', order: 6, subTopicIds: [], questionIds: ['q36', 'q37', 'q38', 'q39', 'q40'] },
            'binary-search': { id: 'binary-search', name: 'Binary Search', order: 7, subTopicIds: [], questionIds: ['q41', 'q42', 'q43', 'q44', 'q45', 'q46'] },
            'stack-queue': { id: 'stack-queue', name: 'Stack and Queue', order: 8, subTopicIds: [], questionIds: ['q47', 'q48', 'q49', 'q50', 'q51'] },
            'binary-tree': { id: 'binary-tree', name: 'Binary Tree', order: 9, subTopicIds: [], questionIds: ['q52', 'q53', 'q54', 'q55', 'q56'] },
            'dp': { id: 'dp', name: 'Dynamic Programming', order: 10, subTopicIds: [], questionIds: ['q57', 'q58', 'q59', 'q60'] },
            'graph': { id: 'graph', name: 'Graph', order: 11, subTopicIds: [], questionIds: ['q61', 'q62', 'q63', 'q64'] },
        },
        allIds: ['arrays', 'arrays-2', 'arrays-3', 'linked-list', 'linked-list-2', 'greedy', 'recursion', 'binary-search', 'stack-queue', 'binary-tree', 'dp', 'graph']
    },
    questions: {
        byId: {
            // Arrays
            'q1': { id: 'q1', title: 'Set Matrix Zeroes', topicId: 'arrays', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/set-matrix-zeroes', isSolved: false },
            'q2': { id: 'q2', title: "Pascal's Triangle", topicId: 'arrays', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/pascals-triangle', isSolved: false },
            'q3': { id: 'q3', title: 'Next Permutation', topicId: 'arrays', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/next-permutation', isSolved: false },
            'q4': { id: 'q4', title: "Kadane's Algorithm", topicId: 'arrays', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/maximum-subarray', isSolved: false },
            'q5': { id: 'q5', title: "Sort Colors (Dutch Flag)", topicId: 'arrays', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/sort-colors', isSolved: false },
            'q6': { id: 'q6', title: 'Stock Buy and Sell', topicId: 'arrays', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock', isSolved: false },
            // Arrays Part-II
            'q7': { id: 'q7', title: 'Rotate Matrix', topicId: 'arrays-2', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/rotate-image', isSolved: false },
            'q8': { id: 'q8', title: 'Merge Overlapping Intervals', topicId: 'arrays-2', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/merge-intervals', isSolved: false },
            'q9': { id: 'q9', title: 'Merge Sorted Arrays', topicId: 'arrays-2', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/merge-sorted-array', isSolved: false },
            'q10': { id: 'q10', title: 'Find the Duplicate Number', topicId: 'arrays-2', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/find-the-duplicate-number', isSolved: false },
            'q11': { id: 'q11', title: 'Repeat and Missing Number', topicId: 'arrays-2', difficulty: 'Medium', platform: 'interviewbit', problemUrl: 'https://www.interviewbit.com/problems/repeat-and-missing-number-array', isSolved: false },
            // Arrays Part-III
            'q12': { id: 'q12', title: 'Search in 2D Matrix', topicId: 'arrays-3', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/search-a-2d-matrix', isSolved: false },
            'q13': { id: 'q13', title: 'Pow(x, n)', topicId: 'arrays-3', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/powx-n', isSolved: false },
            'q14': { id: 'q14', title: 'Majority Element (n/2)', topicId: 'arrays-3', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/majority-element', isSolved: false },
            'q15': { id: 'q15', title: 'Majority Element II (n/3)', topicId: 'arrays-3', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/majority-element-ii', isSolved: false },
            'q16': { id: 'q16', title: 'Grid Unique Paths', topicId: 'arrays-3', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/unique-paths', isSolved: false },
            'q17': { id: 'q17', title: 'Reverse Pairs', topicId: 'arrays-3', difficulty: 'Hard', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/reverse-pairs', isSolved: false },
            // Linked List
            'q18': { id: 'q18', title: 'Reverse Linked List', topicId: 'linked-list', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/reverse-linked-list', isSolved: false },
            'q19': { id: 'q19', title: 'Middle of Linked List', topicId: 'linked-list', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/middle-of-the-linked-list', isSolved: false },
            'q20': { id: 'q20', title: 'Merge Two Sorted Lists', topicId: 'linked-list', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/merge-two-sorted-lists', isSolved: false },
            'q21': { id: 'q21', title: 'Remove Nth Node From End', topicId: 'linked-list', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list', isSolved: false },
            'q22': { id: 'q22', title: 'Add Two Numbers', topicId: 'linked-list', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/add-two-numbers', isSolved: false },
            'q23': { id: 'q23', title: 'Delete Node in a Linked List', topicId: 'linked-list', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/delete-node-in-a-linked-list', isSolved: false },
            // Linked List Part-II
            'q24': { id: 'q24', title: 'Intersection of Two Linked Lists', topicId: 'linked-list-2', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists', isSolved: false },
            'q25': { id: 'q25', title: 'Detect Cycle in Linked List', topicId: 'linked-list-2', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/linked-list-cycle', isSolved: false },
            'q26': { id: 'q26', title: 'Reverse Nodes in k-Group', topicId: 'linked-list-2', difficulty: 'Hard', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group', isSolved: false },
            'q27': { id: 'q27', title: 'Palindrome Linked List', topicId: 'linked-list-2', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/palindrome-linked-list', isSolved: false },
            'q28': { id: 'q28', title: 'Linked List Cycle II', topicId: 'linked-list-2', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/linked-list-cycle-ii', isSolved: false },
            'q29': { id: 'q29', title: 'Flattening a Linked List', topicId: 'linked-list-2', difficulty: 'Medium', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/flattening-a-linked-list', isSolved: false },
            // Greedy
            'q30': { id: 'q30', title: 'N meetings in one room', topicId: 'greedy', difficulty: 'Easy', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/n-meetings-in-one-room', isSolved: false },
            'q31': { id: 'q31', title: 'Minimum Platforms', topicId: 'greedy', difficulty: 'Medium', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/minimum-platforms', isSolved: false },
            'q32': { id: 'q32', title: 'Job Sequencing Problem', topicId: 'greedy', difficulty: 'Medium', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/job-sequencing-problem', isSolved: false },
            'q33': { id: 'q33', title: 'Fractional Knapsack', topicId: 'greedy', difficulty: 'Medium', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/fractional-knapsack', isSolved: false },
            'q34': { id: 'q34', title: 'Minimum Coins', topicId: 'greedy', difficulty: 'Easy', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/coin-change', isSolved: false },
            'q35': { id: 'q35', title: 'Assign Cookies', topicId: 'greedy', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/assign-cookies', isSolved: false },
            // Recursion
            'q36': { id: 'q36', title: 'Subset Sum', topicId: 'recursion', difficulty: 'Medium', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/subset-sum-problem', isSolved: false },
            'q37': { id: 'q37', title: 'Subsets II', topicId: 'recursion', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/subsets-ii', isSolved: false },
            'q38': { id: 'q38', title: 'Combination Sum', topicId: 'recursion', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/combination-sum', isSolved: false },
            'q39': { id: 'q39', title: 'Combination Sum II', topicId: 'recursion', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/combination-sum-ii', isSolved: false },
            'q40': { id: 'q40', title: 'Palindrome Partitioning', topicId: 'recursion', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/palindrome-partitioning', isSolved: false },
            // Binary Search
            'q41': { id: 'q41', title: 'Matrix Median', topicId: 'binary-search', difficulty: 'Hard', platform: 'interviewbit', problemUrl: 'https://www.interviewbit.com/problems/matrix-median', isSolved: false },
            'q42': { id: 'q42', title: 'Single Element in Sorted Array', topicId: 'binary-search', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/single-element-in-a-sorted-array', isSolved: false },
            'q43': { id: 'q43', title: 'Search in Rotated Sorted Array', topicId: 'binary-search', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array', isSolved: false },
            'q44': { id: 'q44', title: 'Median of Two Sorted Arrays', topicId: 'binary-search', difficulty: 'Hard', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays', isSolved: false },
            'q45': { id: 'q45', title: 'K-th element of two sorted arrays', topicId: 'binary-search', difficulty: 'Medium', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/k-th-element-of-two-sorted-array', isSolved: false },
            'q46': { id: 'q46', title: 'Allocate Books', topicId: 'binary-search', difficulty: 'Medium', platform: 'interviewbit', problemUrl: 'https://www.interviewbit.com/problems/allocate-books', isSolved: false },
            // Stack and Queue
            'q47': { id: 'q47', title: 'Implement Stack using Arrays', topicId: 'stack-queue', difficulty: 'Easy', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/implement-stack-using-array', isSolved: false },
            'q48': { id: 'q48', title: 'Implement Queue using Arrays', topicId: 'stack-queue', difficulty: 'Easy', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/implement-queue-using-array', isSolved: false },
            'q49': { id: 'q49', title: 'Implement Stack using Queues', topicId: 'stack-queue', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/implement-stack-using-queues', isSolved: false },
            'q50': { id: 'q50', title: 'Valid Parentheses', topicId: 'stack-queue', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/valid-parentheses', isSolved: false },
            'q51': { id: 'q51', title: 'Next Greater Element', topicId: 'stack-queue', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/next-greater-element-i', isSolved: false },
            // Binary Tree
            'q52': { id: 'q52', title: 'Inorder Traversal', topicId: 'binary-tree', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal', isSolved: false },
            'q53': { id: 'q53', title: 'Preorder Traversal', topicId: 'binary-tree', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/binary-tree-preorder-traversal', isSolved: false },
            'q54': { id: 'q54', title: 'Postorder Traversal', topicId: 'binary-tree', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/binary-tree-postorder-traversal', isSolved: false },
            'q55': { id: 'q55', title: 'Level Order Traversal', topicId: 'binary-tree', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal', isSolved: false },
            'q56': { id: 'q56', title: 'Maximum Depth of Binary Tree', topicId: 'binary-tree', difficulty: 'Easy', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree', isSolved: false },
            // Dynamic Programming
            'q57': { id: 'q57', title: 'Maximum Path Sum', topicId: 'dp', difficulty: 'Hard', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum', isSolved: false },
            'q58': { id: 'q58', title: 'Longest Increasing Subsequence', topicId: 'dp', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/longest-increasing-subsequence', isSolved: false },
            'q59': { id: 'q59', title: 'Longest Common Subsequence', topicId: 'dp', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/longest-common-subsequence', isSolved: false },
            'q60': { id: 'q60', title: '0/1 Knapsack', topicId: 'dp', difficulty: 'Medium', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/0-1-knapsack-problem', isSolved: false },
            // Graph
            'q61': { id: 'q61', title: 'Clone Graph', topicId: 'graph', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/clone-graph', isSolved: false },
            'q62': { id: 'q62', title: 'DFS of Graph', topicId: 'graph', difficulty: 'Easy', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph', isSolved: false },
            'q63': { id: 'q63', title: 'BFS of Graph', topicId: 'graph', difficulty: 'Easy', platform: 'gfg', problemUrl: 'https://practice.geeksforgeeks.org/problems/bfs-traversal-of-graph', isSolved: false },
            'q64': { id: 'q64', title: 'Number of Islands', topicId: 'graph', difficulty: 'Medium', platform: 'leetcode', problemUrl: 'https://leetcode.com/problems/number-of-islands', isSolved: false },
        },
        allIds: ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22', 'q23', 'q24', 'q25', 'q26', 'q27', 'q28', 'q29', 'q30', 'q31', 'q32', 'q33', 'q34', 'q35', 'q36', 'q37', 'q38', 'q39', 'q40', 'q41', 'q42', 'q43', 'q44', 'q45', 'q46', 'q47', 'q48', 'q49', 'q50', 'q51', 'q52', 'q53', 'q54', 'q55', 'q56', 'q57', 'q58', 'q59', 'q60', 'q61', 'q62', 'q63', 'q64']
    },
    // Sub-topics entity (for organizing questions within topics)
    subTopics: {
        byId: {},
        allIds: []
    },
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
    dataSource: 'sample' // 'sample' | 'api'
};

export const useQuestionStore = create(
    persist(
        (set, get) => ({
            ...sampleData,

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
            name: 'question-manager-storage',
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
