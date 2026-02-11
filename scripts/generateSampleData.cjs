const fs = require('fs');
const path = require('path');

const sheetPath = path.resolve(__dirname, '..', 'sheet.json');
const outputPath = path.resolve(__dirname, '..', 'src', 'data', 'sampleData.js');

const raw = JSON.parse(fs.readFileSync(sheetPath, 'utf-8'));
const apiQuestions = raw.data.questions;

// Helper: create a URL-friendly slug from a string
function slugify(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Fix encoding issues
function fixEncoding(text) {
    if (!text || typeof text !== 'string') return text;
    const greekPattern = String.fromCharCode(915, 199, 214);
    const cyrillicPattern = String.fromCharCode(1043, 199, 214);
    return text
        .replace(new RegExp(greekPattern, 'g'), "'")
        .replace(new RegExp(cyrillicPattern, 'g'), "'")
        .replace(/\u00e2\u0080\u0099/g, "'")
        .replace(/\u00e2\u0080\u009c/g, '"')
        .replace(/\u00e2\u0080\u009d/g, '"')
        .replace(/\u00e2\u0080\u0093/g, '–')
        .replace(/\u00e2\u0080\u0094/g, '—');
}

// Normalize difficulty levels
function normalizeDifficulty(diff) {
    if (!diff) return 'Medium';
    const d = diff.toLowerCase();
    if (d === 'easy') return 'Easy';
    if (d === 'medium') return 'Medium';
    if (d === 'hard') return 'Hard';
    return 'Medium';
}

// Build topics, sub-topics, and questions
const topicsById = {};
const topicsAllIds = [];
const subTopicsById = {};
const subTopicsAllIds = [];
const questionsById = {};
const questionsAllIds = [];

let topicOrder = 0;
const topicSlugMap = {}; // name -> slug
const subTopicSlugMap = {}; // "topicSlug--subTopicSlug" -> true

apiQuestions.forEach((item, idx) => {
    const topicName = fixEncoding(item.topic || 'Uncategorized');
    const subTopicName = fixEncoding(item.subTopic || '');
    const topicSlug = slugify(topicName);

    // Create topic if not exists
    if (!topicSlugMap[topicName]) {
        topicSlugMap[topicName] = topicSlug;
        topicsById[topicSlug] = {
            id: topicSlug,
            name: topicName,
            order: topicOrder++,
            subTopicIds: [],
            questionIds: []
        };
        topicsAllIds.push(topicSlug);
    }
    const topic = topicsById[topicSlugMap[topicName]];

    // Create sub-topic if not exists
    let subTopicId = null;
    if (subTopicName) {
        subTopicId = topicSlugMap[topicName] + '--' + slugify(subTopicName);
        if (!subTopicSlugMap[subTopicId]) {
            subTopicSlugMap[subTopicId] = true;
            subTopicsById[subTopicId] = {
                id: subTopicId,
                name: subTopicName,
                topicId: topicSlugMap[topicName],
                order: topic.subTopicIds.length,
                questionIds: []
            };
            subTopicsAllIds.push(subTopicId);
            topic.subTopicIds.push(subTopicId);
        }
    }

    // Create question
    const qId = 'q' + idx;
    const qData = item.questionId || {};
    const question = {
        id: qId,
        title: fixEncoding(item.title || qData.title || 'Untitled'),
        topicId: topicSlugMap[topicName],
        difficulty: normalizeDifficulty(qData.difficulty),
        platform: qData.platform || 'unknown',
        problemUrl: qData.problemUrl || '',
        isSolved: item.isSolved || false
    };

    if (subTopicId) {
        question.subTopicId = subTopicId;
        subTopicsById[subTopicId].questionIds.push(qId);
    } else {
        topic.questionIds.push(qId);
    }

    questionsById[qId] = question;
    questionsAllIds.push(qId);
});

const sampleData = {
    topics: { byId: topicsById, allIds: topicsAllIds },
    questions: { byId: questionsById, allIds: questionsAllIds },
    subTopics: { byId: subTopicsById, allIds: subTopicsAllIds }
};

// Ensure output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const output = `// Auto-generated from sheet.json by scripts/generateSampleData.cjs
// Strivers A2Z DSA Sheet - ${questionsAllIds.length} questions, ${topicsAllIds.length} topics, ${subTopicsAllIds.length} sub-topics

const sampleData = ${JSON.stringify(sampleData, null, 2)};

export default sampleData;
`;

fs.writeFileSync(outputPath, output, 'utf-8');

console.log(`Generated sampleData.js:`);
console.log(`  Topics: ${topicsAllIds.length}`);
console.log(`  Sub-topics: ${subTopicsAllIds.length}`);
console.log(`  Questions: ${questionsAllIds.length}`);
