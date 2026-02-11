#!/usr/bin/env node
/**
 * Transforms sheet.json into the Zustand store's sampleData format.
 * Outputs src/data/sampleData.js
 * 
 * Usage: node scripts/generateSampleData.js
 */

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

// Fix encoding issues (same as in questionApi.js)
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

// ------- Build the data structures -------

const topicsById = {};
const topicAllIds = [];
const subTopicsById = {};
const subTopicAllIds = [];
const questionsById = {};
const questionAllIds = [];

// Track ordering
let topicOrder = 0;
const topicSlugMap = {}; // "topic name" -> slug
const subTopicSlugMap = {}; // "topic|||subtopic" -> slug

// First pass: discover all unique topics (preserving order from JSON)
const seenTopics = new Set();
apiQuestions.forEach(q => {
    const topicName = fixEncoding(q.topic);
    if (!seenTopics.has(topicName)) {
        seenTopics.add(topicName);
        const slug = slugify(topicName);
        topicSlugMap[topicName] = slug;
        topicsById[slug] = {
            id: slug,
            name: topicName,
            order: topicOrder++,
            subTopicIds: [],
            questionIds: []
        };
        topicAllIds.push(slug);
    }
});

// Second pass: discover all unique sub-topics (preserving order)
const seenSubTopics = new Set();
let subTopicOrder = 0;
apiQuestions.forEach(q => {
    const topicName = fixEncoding(q.topic);
    const subTopicName = fixEncoding(q.subTopic);
    if (!subTopicName) return;

    const key = topicName + '|||' + subTopicName;
    if (!seenSubTopics.has(key)) {
        seenSubTopics.add(key);
        const topicSlug = topicSlugMap[topicName];
        const stSlug = topicSlug + '--' + slugify(subTopicName);
        subTopicSlugMap[key] = stSlug;

        subTopicsById[stSlug] = {
            id: stSlug,
            name: subTopicName,
            topicId: topicSlug,
            order: subTopicOrder++,
            questionIds: []
        };
        subTopicAllIds.push(stSlug);

        // Register sub-topic in topic
        topicsById[topicSlug].subTopicIds.push(stSlug);
    }
});

// Third pass: build questions and assign them to sub-topics
let qIndex = 0;
apiQuestions.forEach(q => {
    const topicName = fixEncoding(q.topic);
    const subTopicName = fixEncoding(q.subTopic);
    const topicSlug = topicSlugMap[topicName];
    const questionId = `q${qIndex++}`;

    const questionData = q.questionId || {};
    let difficulty = questionData.difficulty || 'Medium';
    if (difficulty.toLowerCase() === 'basic') difficulty = 'Easy';
    // Capitalize first letter
    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    const platform = questionData.platform || 'leetcode';
    const problemUrl = questionData.problemUrl || '#';
    const title = fixEncoding(q.title || questionData.name || 'Untitled');

    questionsById[questionId] = {
        id: questionId,
        title,
        topicId: topicSlug,
        difficulty,
        platform,
        problemUrl,
        isSolved: false
    };
    questionAllIds.push(questionId);

    // Assign to sub-topic
    if (subTopicName) {
        const key = topicName + '|||' + subTopicName;
        const stSlug = subTopicSlugMap[key];
        if (stSlug && subTopicsById[stSlug]) {
            questionsById[questionId].subTopicId = stSlug;
            subTopicsById[stSlug].questionIds.push(questionId);
        }
    } else {
        // Direct topic question (no sub-topic)
        topicsById[topicSlug].questionIds.push(questionId);
    }
});

// ------- Output -------
const outputData = {
    topics: { byId: topicsById, allIds: topicAllIds },
    questions: { byId: questionsById, allIds: questionAllIds },
    subTopics: { byId: subTopicsById, allIds: subTopicAllIds }
};

// Ensure output dir exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const jsContent = `// Auto-generated from sheet.json by scripts/generateSampleData.js
// Strivers A2Z DSA Sheet - ${questionAllIds.length} questions, ${topicAllIds.length} topics, ${subTopicAllIds.length} sub-topics

const sampleData = ${JSON.stringify(outputData, null, 2)};

export default sampleData;
`;

fs.writeFileSync(outputPath, jsContent, 'utf-8');

console.log(`✅ Generated sampleData.js`);
console.log(`   Topics: ${topicAllIds.length}`);
console.log(`   Sub-topics: ${subTopicAllIds.length}`);
console.log(`   Questions: ${questionAllIds.length}`);
console.log(`   Output: ${outputPath}`);
