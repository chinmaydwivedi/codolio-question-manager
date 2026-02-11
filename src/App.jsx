import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useQuestionStore } from './store/questionStore';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import Toolbar from './components/Toolbar';
import TopicCard from './components/TopicCard';
import Modal from './components/Modal';

function App() {
  const {
    topics,
    getFilteredTopics,
    reorderTopics,
    ui,
    isLoading,
    error,
    clearError
  } = useQuestionStore();

  // Data is pre-loaded from sampleData.js via the store.
  // To fetch from API, trigger fetchFromApi() manually (e.g., via a button).

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const filteredTopics = getFilteredTopics();

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTopics(active.id, over.id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="app-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading questions from Codolio API...</div>
        </div>
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="app-container">
        <Header />
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-title">Failed to load data</div>
          <div className="error-message">{error}</div>
          <button className="btn btn-primary" onClick={() => { clearError(); fetchFromApi(); }}>
            Retry
          </button>
          <button className="btn btn-secondary" onClick={clearError} style={{ marginTop: '10px' }}>
            Use Sample Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />
      <StatsBar />
      <Toolbar />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filteredTopics.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="topics-container">
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📚</div>
                <div className="empty-state-title">No topics found</div>
                <div className="empty-state-description">
                  {ui.searchQuery
                    ? "Try adjusting your search query"
                    : "Click 'Add Topic' to get started"}
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {ui.modal && <Modal />}
    </div>
  );
}

export default App;

