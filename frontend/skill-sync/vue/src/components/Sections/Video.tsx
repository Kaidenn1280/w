import { useState, useMemo } from "react";
import { lessons, subjects, type Lesson } from "../../mock/data";
import FavoriteButton from "../ui/FavoriteButton";
import "../../styles/VideosSection.css";

// Simple, professional color mapping
const getSubjectColor = (subject: string) => {
  const colors: Record<string, string> = {
    "Math & Logic": "#f59e0b",       // Amber
    "Computer Science": "#3b82f6",   // Blue
    "Languages": "#8b5cf6",          // Violet
    "Humanities": "#ec4899",         // Pink
    "Sciences": "#10b981",           // Emerald
  };
  return colors[subject] || "#64748b"; // Default Slate
};

interface VideosSectionProps {
  isActive: boolean;
}

const VideosSection = ({ isActive }: VideosSectionProps) => {
  const [activeSubject, setActiveSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number, left: number } | null>(null);

  const handleOpenLesson = (e: React.MouseEvent, lesson: Lesson) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Center the popover over the card
    // Center the popover over the card relative to viewport
    setPopoverPosition({
      top: rect.top + (rect.height / 2),
      left: rect.left + (rect.width / 2)
    });
    setSelectedLesson(lesson);
  };

  // Filter Logic
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchSubject = activeSubject === "All" || lesson.subject === activeSubject;
      const matchSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubject && matchSearch;
    });
  }, [activeSubject, searchQuery]);

  return (
    // Added 'vid-lib-section' class to match the CSS selector
    <section id="videos" className={`page-section vid-lib-section ${isActive ? "active" : ""}`}>
      <div className="vid-lib-container">

        {/* --- Header & Search --- */}
        <div className="vid-lib-header">
          <div className="vid-lib-title-group">
            <h2>Video Library</h2>
            <p>Access high-quality lessons across multiple disciplines.</p>
          </div>

          <div className="vid-lib-search-wrapper">
            <i className="fas fa-search search-icon" />
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* --- Filter Bar --- */}
        <div className="vid-lib-filters">
          <button
            className={`filter-chip ${activeSubject === "All" ? "active" : ""}`}
            onClick={() => setActiveSubject("All")}
          >
            All Subjects
          </button>
          {subjects.map((sub) => (
            <button
              key={sub}
              className={`filter-chip ${activeSubject === sub ? "active" : ""}`}
              onClick={() => setActiveSubject(sub)}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* --- Grid Layout --- */}
        <div className="vid-lib-grid">
          {filteredLessons.map((lesson) => {
            const accentColor = getSubjectColor(lesson.subject);
            return (
              <div
                key={lesson.id}
                className="vid-card"
                onClick={(e) => handleOpenLesson(e, lesson)}
                /* ADD THIS LINE BELOW: defines a variable called --card-accent */
                style={{ "--card-accent": accentColor } as React.CSSProperties}
              >
                {/* Card Header (Color Strip) */}
                <div
                  className="vid-card-top"
                  style={{ background: `linear-gradient(135deg, ${accentColor}, #1e293b)` }}
                >
                  <FavoriteButton id={lesson.id} type="video" className="vid-card-favorite" />
                  <div className="vid-play-overlay">
                    <i className="fas fa-play" />
                  </div>
                  <span className="vid-level-badge">{lesson.level}</span>
                </div>

                {/* Card Body */}
                <div className="vid-card-body">
                  <div className="vid-meta">
                    <span className="vid-subject" style={{ color: accentColor }}>
                      {lesson.subject}
                    </span>
                    <span className="vid-duration">
                      <i className="far fa-clock" /> {lesson.duration}
                    </span>
                  </div>

                  <h3 className="vid-title">{lesson.title}</h3>

                  <div className="vid-card-footer">
                    <button className="vid-btn-link">
                      View Lesson <i className="fas fa-arrow-right" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- Professional Popover --- */}
      {selectedLesson && popoverPosition && (
        <div className="vid-popover-overlay" onClick={() => setSelectedLesson(null)}>
          <div
            className="vid-popover-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`
            }}
          >
            <div className="vid-modal-header">
              <div>
                <span className="vid-modal-subtitle">{selectedLesson.subject}</span>
                <h3>{selectedLesson.title}</h3>
              </div>
              <button className="vid-modal-close" onClick={() => setSelectedLesson(null)}>
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="vid-modal-content">
              <div className="vid-stats-row">
                <div className="vid-stat">
                  <label>Level</label>
                  <span>{selectedLesson.level}</span>
                </div>
                <div className="vid-stat">
                  <label>Duration</label>
                  <span>{selectedLesson.duration}</span>
                </div>
                <div className="vid-stat">
                  <label>Format</label>
                  <span>{selectedLesson.type}</span>
                </div>
              </div>

              <div className="vid-desc">
                <h4>Overview</h4>
                <p>
                  This module covers key concepts in <strong>{selectedLesson.title}</strong>.
                  Designed for <strong>{selectedLesson.level}</strong> students,
                  this {selectedLesson.duration} session will help reinforce your understanding.
                </p>
              </div>
            </div>

            <div className="vid-modal-actions">
              <button className="vid-btn-primary" onClick={() => {
                alert(`Starting lesson: ${selectedLesson.title}`);
                setSelectedLesson(null);
              }}>
                Start Watching
              </button>
              <FavoriteButton
                id={selectedLesson.id}
                type="video"
                className="vid-btn-secondary"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideosSection;