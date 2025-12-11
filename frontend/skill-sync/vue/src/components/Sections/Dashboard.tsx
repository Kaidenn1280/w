// src/components/sections/DashboardSection.tsx
import FavoriteButton from "../ui/FavoriteButton";

type Props = {
  isActive: boolean;
  onGoToSubmit: () => void;
};

const DashboardSection = ({ isActive, onGoToSubmit }: Props) => {
  return (
    <section
      id="dashboard"
      className={`page-section ${isActive ? "active" : ""}`}
    >
      <div className="container">
        <div className="dashboard-hero">
          <div className="dashboard-hero-content">
            <h1>Welcome back, Students!</h1>
            <p>
              Inspiring, accessible, and free education for everyone. Continue
              your learning journey today.
            </p>
            <button className="btn btn-primary btn-lg" type="button">
              Resume &quot;Intro to Python&quot;
            </button>
          </div>
          <i className="fas fa-rocket dashboard-hero-image" />
        </div>

        <div className="section-header">
          <h2>Popular Subjects</h2>
        </div>

        <div className="categories-pills">
          <button className="category-pill active" type="button">
            All
          </button>
          <button className="category-pill" type="button">
            Math &amp; Logic
          </button>
          <button className="category-pill" type="button">
            Computer Science
          </button>
          <button className="category-pill" type="button">
            Languages
          </button>
          <button className="category-pill" type="button">
            Humanities
          </button>
          <button className="category-pill" type="button">
            Sciences
          </button>
        </div>

        <div className="section-header">
          <h2>Recommended For You &amp; Trending</h2>
        </div>

        <div className="grid">
          {/* Card 1 */}
          <div className="card video">
            <div className="card-image">
              <i className="fas fa-play-circle" />
              <div className="card-badges">
                <span className="badge">
                  <i className="fas fa-video" /> Video Series
                </span>
                <span className="badge difficulty">Beginner</span>
              </div>
              <FavoriteButton id={1} type="video" />
            </div>
            <div className="card-body">
              <h3 className="card-title">Algebra I Foundations</h3>
              <div className="card-tags">
                <span className="tag">Math</span>
                <span className="tag">High School</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Master the basics of algebra with easy-to-follow video modules.
              </p>
              <div className="card-footer">
                <button className="card-btn" type="button">
                  Start Watching
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card download">
            <div className="card-image">
              <i className="fas fa-file-pdf" />
              <div className="card-badges">
                <span className="badge">
                  <i className="fas fa-file-alt" /> Textbook PDF
                </span>
                <span className="badge difficulty">Intermediate</span>
              </div>
              <FavoriteButton id={1} type="download" />
            </div>
            <div className="card-body">
              <h3 className="card-title">OpenStax: U.S. History</h3>
              <div className="card-tags">
                <span className="tag">Humanities</span>
                <span className="tag">College Prep</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Comprehensive, peer-reviewed textbook covering key historical
                events.
              </p>
              <div className="card-footer">
                <button className="card-btn" type="button">
                  <i className="fas fa-download" /> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card video">
            <div
              className="card-image"
              style={{
                background:
                  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
              }}
            >
              <i className="fas fa-code" />
              <div className="card-badges">
                <span className="badge">Interactive</span>
                <span className="badge difficulty">Beginner</span>
              </div>
              <FavoriteButton id={2} type="video" />
            </div>
            <div className="card-body">
              <h3 className="card-title">Web Dev Bootcamp: HTML &amp; CSS</h3>
              <div className="card-tags">
                <span className="tag">Coding</span>
                <span className="tag">Web</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Build your first website from scratch using modern web
                standards.
              </p>
              <div className="card-footer">
                <button className="card-btn" type="button">
                  Start Course
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <p className="section-subtitle">
            Have helpful materials? Help the community grow.
          </p>
          <button
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
            type="button"
            onClick={onGoToSubmit}
          >
            <i className="fas fa-plus-circle" /> Submit a Resource
          </button>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
