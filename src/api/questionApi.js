const API_BASE_URL = 'https://node.codolio.com/api/question-tracker/v1';

/**
 * Fix common encoding issues (mojibake) from API responses
 * The API returns UTF-8 characters that were double-encoded, resulting in
 * sequences like ΓÇÖ (Greek Gamma + Ç + Ö) instead of proper apostrophes.
 */
function fixEncoding(text) {
    if (!text || typeof text !== 'string') return text;

    // Using character codes for reliable matching:
    // Greek Gamma (Γ) = 915, Ç = 199, Ö = 214
    // Cyrillic Ge (Г) = 1043
    const greekPattern = String.fromCharCode(915, 199, 214);  // ΓÇÖ → '
    const cyrillicPattern = String.fromCharCode(1043, 199, 214);  // ГÇÖ → '
    const suffixPattern = String.fromCharCode(199, 214);  // ÇÖ → '

    return text
        .replace(new RegExp(greekPattern, 'g'), "'")
        .replace(new RegExp(cyrillicPattern, 'g'), "'")
        .replace(new RegExp(suffixPattern, 'g'), "'");  // Fallback for partial match
}

/**
 * Fetches the Striver SDE Sheet from the Codolio API
 * @returns {Promise<{topics: object, questions: object}>} Normalized data for the store
 */
export async function fetchSheetBySlug(slug = 'striver-sde-sheet') {
    const response = await fetch(`${API_BASE_URL}/sheet/public/get-sheet-by-slug/${slug}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.status?.success) {
        throw new Error(data.status?.message || 'Failed to fetch sheet data');
    }

    return transformApiData(data.data);
}

/**
 * Transforms API response into the normalized format used by the store
 * @param {object} apiData - The data object from the API response
 * @returns {{topics: object, questions: object}}
 */
function transformApiData(apiData) {
    const { sheet, questions: apiQuestions } = apiData;

    // Get topic order from sheet config
    const topicOrder = sheet.config?.topicOrder || [];

    // Group questions by topic
    const questionsByTopic = {};
    apiQuestions.forEach((q) => {
        const topic = q.topic;
        if (!questionsByTopic[topic]) {
            questionsByTopic[topic] = [];
        }
        questionsByTopic[topic].push(q);
    });

    // Build normalized topics
    const topicsById = {};
    const allTopicIds = [];

    topicOrder.forEach((topicName, index) => {
        // Create a URL-friendly ID from the topic name
        const topicId = topicName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Get questions for this topic
        const topicQuestions = questionsByTopic[topicName] || [];
        const questionIds = topicQuestions.map(q => q._id);

        topicsById[topicId] = {
            id: topicId,
            name: topicName,
            order: index,
            questionIds: questionIds
        };

        allTopicIds.push(topicId);
    });

    // Build normalized questions
    const questionsById = {};
    const allQuestionIds = [];

    apiQuestions.forEach((q, index) => {
        const questionId = q._id;
        const questionData = q.questionId || {};

        // Determine difficulty - use the nested questionId's difficulty or default to Medium
        let difficulty = questionData.difficulty || 'Medium';
        // Normalize difficulty (some might be lowercase or have different casing)
        if (difficulty.toLowerCase() === 'easy' || difficulty.toLowerCase() === 'basic') {
            difficulty = 'Easy';
        } else if (difficulty.toLowerCase() === 'hard') {
            difficulty = 'Hard';
        } else {
            difficulty = 'Medium';
        }

        questionsById[questionId] = {
            id: questionId,
            title: fixEncoding(q.title || questionData.name || 'Untitled Question'),
            difficulty: difficulty,
            completed: false, // Will be persisted in localStorage
            noteIds: [],
            link: questionData.problemUrl || q.resource || '',
            order: index
        };

        allQuestionIds.push(questionId);
    });

    return {
        topics: {
            byId: topicsById,
            allIds: allTopicIds
        },
        questions: {
            byId: questionsById,
            allIds: allQuestionIds
        },
        sheetInfo: {
            name: sheet.name,
            description: sheet.description,
            banner: sheet.banner,
            followers: sheet.followers
        }
    };
}

// CRUD operations (in-memory, no database)
// These work with the local state and persist via localStorage

/**
 * Creates a new topic (local only)
 */
export function createTopic(name, order) {
    const id = `custom-${Date.now()}`;
    return {
        id,
        name,
        order,
        questionIds: []
    };
}

/**
 * Creates a new question (local only)
 */
export function createQuestion(title, difficulty, link = '', order) {
    const id = `custom-q-${Date.now()}`;
    return {
        id,
        title,
        difficulty,
        completed: false,
        noteIds: [],
        link,
        order
    };
}

/**
 * Updates a topic (local only)
 */
export function updateTopic(topic, updates) {
    return { ...topic, ...updates };
}

/**
 * Updates a question (local only)
 */
export function updateQuestion(question, updates) {
    return { ...question, ...updates };
}

export default {
    fetchSheetBySlug,
    createTopic,
    createQuestion,
    updateTopic,
    updateQuestion
};
