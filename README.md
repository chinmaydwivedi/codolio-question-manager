# Question Management Sheet

A single-page web application for managing and tracking DSA (Data Structures and Algorithms) questions, built as part of the Codolio Frontend Developer Assessment. The application ships with a pre-loaded dataset of **449 questions** organized across **18 topics** and **59 sub-topics**, sourced from the Striver SDE Sheet.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Data Architecture](#data-architecture)
- [API Integration](#api-integration)
- [Additional Enhancements](#additional-enhancements)
- [Data Persistence](#data-persistence)
- [Author](#author)

---

## Overview

This application provides an intuitive interface for organizing and tracking progress on coding interview questions. Users can manage their preparation journey through a hierarchical structure of Topics, Sub-topics, and Questions, with full CRUD operations, drag-and-drop reordering, and real-time progress tracking.

The application comes pre-loaded with the complete Striver SDE Sheet dataset (449 questions), which is generated from `sheet.json` using a custom transformation script. It also supports fetching data from the Codolio public API.

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| Topic Management | Add, edit, delete, and reorder topics using drag-and-drop |
| Sub-topic Management | Create sub-topics within topics for hierarchical organization |
| Question Management | Full CRUD operations with difficulty levels (Easy, Medium, Hard) |
| Progress Tracking | Visual progress bars showing completion status per topic and sub-topic |
| Search and Filtering | Filter topics and questions by name in real time |
| Persistent Storage | All data persists in localStorage across browser sessions |

### User Interface

- Collapsible topic cards with expand/collapse functionality
- Drag-and-drop reordering for topics and questions via intuitive drag handles
- Color-coded difficulty badges (Easy: Green, Medium: Yellow, Hard: Red)
- Real-time statistics dashboard showing total, completed, and per-difficulty distribution
- Dark theme with glassmorphism effects inspired by the Codolio design language
- Confetti animation on topic completion for positive reinforcement
- Pulsing neon glow effect on fully completed topics

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 with Vite |
| State Management | Zustand with localStorage persistence |
| Drag and Drop | @dnd-kit/core, @dnd-kit/sortable |
| Styling | Vanilla CSS with CSS custom properties |
| Animations | canvas-confetti |
| Build Tool | Vite |

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/chinmaydwivedi/codolio-question-manager.git

# Navigate to the project directory
cd codolio-question-manager

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
codolio-question-manager/
├── scripts/
│   └── generateSampleData.cjs   # Transforms sheet.json into store-ready format
├── sheet.json                    # Source dataset (Striver SDE Sheet)
├── src/
│   ├── api/
│   │   └── questionApi.js       # API integration and data transformation
│   ├── components/
│   │   ├── Header.jsx           # Application header
│   │   ├── StatsBar.jsx         # Statistics dashboard
│   │   ├── Toolbar.jsx          # Search bar and action buttons
│   │   ├── TopicCard.jsx        # Topic card with drag-and-drop support
│   │   ├── SubTopicCard.jsx     # Sub-topic card component
│   │   ├── QuestionCard.jsx     # Question card with completion toggle
│   │   ├── Modal.jsx            # Add, Edit, and Delete confirmation modals
│   │   └── DifficultyBadge.jsx  # Color-coded difficulty indicator
│   ├── data/
│   │   └── sampleData.js        # Auto-generated dataset (449 questions)
│   ├── store/
│   │   └── questionStore.js     # Zustand store with all state logic and actions
│   ├── App.jsx                  # Main application component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles and theme variables
├── package.json
└── vite.config.js
```

---

## Data Architecture

The application uses a normalized state structure for efficient lookups and updates:

```javascript
{
  topics:    { byId: {}, allIds: [] },
  subTopics: { byId: {}, allIds: [] },
  questions: { byId: {}, allIds: [] }
}
```

### Pre-loaded Dataset

The initial dataset is generated from `sheet.json` using the `scripts/generateSampleData.cjs` script. This script handles:

- Slug generation for unique identifiers
- Difficulty normalization across inconsistent source data
- Text encoding fixes for special characters
- Hierarchical structuring into topics, sub-topics, and questions

To regenerate the dataset after modifying `sheet.json`:

```bash
node scripts/generateSampleData.cjs
```

This outputs `src/data/sampleData.js`, which is imported by the Zustand store as the default initial state.

### Dataset Summary

| Metric | Count |
|--------|-------|
| Total Questions | 449 |
| Topics | 18 |
| Sub-topics | 59 |
| Easy | 124 |
| Medium | 270 |
| Hard | 55 |

---

## API Integration

The application can optionally fetch data from the Codolio public API:

```
GET https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet
```

The API response is normalized into the same data structure used by the pre-loaded dataset, ensuring seamless switching between data sources.

---

## Additional Enhancements

Beyond the core requirements, the following features have been implemented:

### Confetti Celebration

When all questions within a topic are marked as completed, a confetti animation fires to celebrate the milestone. This is implemented using the `canvas-confetti` library with colors matching the application theme.

### Neon Glow Effect

Topics at 100% completion are visually distinguished with a pulsing neon green border. This uses layered CSS box-shadows and keyframe animations to create a glowing effect.

### Sub-topic Support

Full hierarchical organization:

- Topics contain sub-topics, which in turn contain questions
- Independent progress tracking at both the topic and sub-topic level
- Add, edit, and delete sub-topics within any topic
- Drag-and-drop reordering within sub-topics

### Character Encoding Fix

A custom `fixEncoding` function handles encoding inconsistencies in API responses (such as curly quotes rendered as garbled text), ensuring proper display of all question titles.

### Responsive Design

The application is fully responsive across:

- Desktop (1280px and above)
- Tablet (768px to 1279px)
- Mobile (320px to 767px)

---

## Data Persistence

All application state is persisted in the browser's localStorage using Zustand's persist middleware. Persisted state includes:

- Topic and question completion status
- User-created topics, sub-topics, and questions
- Topic and question ordering preferences
- UI state (expanded/collapsed topics, search query)

Clearing localStorage and reloading the page will reset the application to the default 449-question dataset.

---

## License

This project was created as part of the Codolio Frontend Developer Assessment.

---

## Author

Chinmay Dwivedi
