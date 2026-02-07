# Interactive Question Management Sheet

A single-page web application for managing and tracking DSA (Data Structures and Algorithms) questions. Built as part of the Codolio Frontend Developer Assessment.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Additional Features](#additional-features)
- [Screenshots](#screenshots)

---

## Overview

This application provides an intuitive interface for organizing and tracking progress on coding interview questions. It integrates with the Codolio API to fetch the Striver SDE Sheet questions and allows users to manage their preparation journey with a hierarchical structure of Topics, Sub-topics, and Questions.

---

## Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Topic Management** | Add, edit, delete, and reorder topics using drag-and-drop |
| **Sub-topic Management** | Create sub-topics within topics for better organization |
| **Question Management** | Full CRUD operations for questions with difficulty levels |
| **Progress Tracking** | Visual progress bars showing completion status per topic |
| **Search Functionality** | Filter topics and questions by name |
| **Persistent Storage** | All data persists in localStorage across sessions |

### User Interface

- **Collapsible Topics**: Expand/collapse topics to view questions
- **Drag-and-Drop Reordering**: Reorder topics and questions with intuitive drag handles
- **Difficulty Badges**: Color-coded badges (Easy: Green, Medium: Yellow, Hard: Red)
- **Stats Dashboard**: Real-time statistics showing total, completed, and difficulty distribution
- **Premium Dark Theme**: Codolio-inspired dark theme with glassmorphism effects

---

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 with Vite |
| State Management | Zustand with localStorage persistence |
| Drag and Drop | @dnd-kit/core, @dnd-kit/sortable |
| Styling | Vanilla CSS with CSS Variables |
| Animations | canvas-confetti |
| Build Tool | Vite |

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
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

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
src/
├── api/
│   └── questionApi.js      # API integration and data transformation
├── components/
│   ├── Header.jsx          # Application header
│   ├── StatsBar.jsx        # Statistics dashboard
│   ├── Toolbar.jsx         # Search and action buttons
│   ├── TopicCard.jsx       # Topic card with drag-and-drop
│   ├── SubTopicCard.jsx    # Sub-topic card component
│   ├── QuestionCard.jsx    # Question card with checkbox
│   ├── Modal.jsx           # Add/Edit/Delete modals
│   └── DifficultyBadge.jsx # Difficulty indicator component
├── store/
│   └── questionStore.js    # Zustand store with all state logic
├── App.jsx                 # Main application component
├── main.jsx                # Application entry point
└── index.css               # Global styles and theme
```

---

## API Integration

The application fetches data from the Codolio public API:

```
GET https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet
```

The API response is normalized into an optimized data structure for efficient lookups and updates:

```javascript
{
  topics: { byId: {}, allIds: [] },
  subTopics: { byId: {}, allIds: [] },
  questions: { byId: {}, allIds: [] }
}
```

---

## Additional Features

Beyond the core requirements, the following enhancements have been implemented:

### 1. Confetti Celebration

When a user completes all questions within a topic (100% progress), a confetti animation is triggered to celebrate the achievement. This provides positive reinforcement and enhances user engagement.

**Implementation**: Uses the `canvas-confetti` library with custom colors matching the application theme.

### 2. Neon Glow Effect for Completed Topics

Topics with 100% completion are visually distinguished with a pulsing neon green border effect. This creates a clear visual hierarchy between completed and in-progress topics.

**CSS Features**:
- Multiple layered box-shadows for glow effect
- CSS keyframe animation for pulsing effect
- Gradient background overlay on completed topic headers

### 3. Sub-topic Support

Full hierarchical organization with Topics > Sub-topics > Questions structure:
- Add sub-topics within any topic
- Questions can be assigned to sub-topics
- Independent progress tracking per sub-topic
- Drag-and-drop reordering within sub-topics

### 4. Character Encoding Fix

The API returns certain characters with encoding issues (e.g., curly quotes appearing as garbled text). A custom `fixEncoding` function handles these edge cases to ensure proper display of all question titles.

### 5. Responsive Design

The application is fully responsive and works across:
- Desktop browsers (optimized for 1280px+)
- Tablets (768px - 1279px)
- Mobile devices (320px - 767px)

---

## Data Persistence

All application state is persisted in the browser's localStorage using Zustand's persist middleware. This includes:

- Topic and question completion status
- User-created topics, sub-topics, and questions
- Reordering preferences
- UI state (expanded/collapsed topics)

---

## License

This project was created as part of the Codolio Frontend Developer Assessment.

---

## Author

Chinmay Dwivedi
