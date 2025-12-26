// src/components/sections/DashboardSection.tsx
import { useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import FavoriteButton from "../ui/FavoriteButton";

type Props = {
  isActive: boolean;
  onGoToSubmit: () => void;
  searchQuery?: string;
};

const DashboardSection = ({ isActive, onGoToSubmit, searchQuery = "" }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  /* State for the Course Detail Modal (Popover) */
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number, left: number } | null>(null);

  // Dynamic auth state
  const { user, isAuthenticated } = useAuth();
  // Determine user state based on auth and account age (new = created < 24h ago)
  const userState = isAuthenticated ? 'returning' : 'guest';

  const handleOpenPopover = (e: React.MouseEvent<HTMLButtonElement>, course: any) => {
    e.stopPropagation(); // Prevent closing immediately if we had a click listener
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate position: Center the popover above the button if possible, else below
    // Simple logic: Place it centered horizontally on the button, and slightly above/overlaying
    const top = rect.top + window.scrollY; // Absolute top
    const left = rect.left + window.scrollX + (rect.width / 2); // Center horizontally

    setPopoverPosition({ top, left });
    setSelectedCourse(course);
  };

  const allCourses = [
    {
      id: 1,
      title: "Algebra I Foundations",
      category: "Math & Logic",
      type: "video",
      level: "Beginner",
      icon: "fas fa-calculator", // Specific icon for the topic
      badge: "Video Series",
      description: "Master the basics of algebra with easy-to-follow video modules.",
      content: [
        "Module 1: Linear Equations",
        "Module 2: Inequalities",
        "Module 3: Functions & Graphs",
        "Module 4: Systems of Equations"
      ]
    },
    {
      id: 2,
      title: "OpenStax: U.S. History",
      category: "Humanities",
      type: "download",
      level: "Intermediate",
      icon: "fas fa-landmark",
      badge: "Textbook PDF",
      description: "Comprehensive, peer-reviewed textbook covering key historical events.",
      content: [
        "Chapter 1: The Americas, Europe, and Africa",
        "Chapter 2: Early Globalization",
        "Chapter 3: Colonial Society",
        "Chapter 4: The American Revolution"
      ]
    },
    {
      id: 3,
      title: "Web Dev Bootcamp",
      category: "Computer Science",
      type: "video",
      level: "Beginner",
      icon: "fas fa-code",
      badge: "Interactive",
      description: "Build your first website from scratch using modern web standards.",
      content: [
        "Week 1: HTML5 Basics",
        "Week 2: CSS3 Styling & Layouts",
        "Week 3: Responsive Design",
        "Week 4: Intro to JavaScript"
      ]
    },
    {
      id: 4,
      title: "Intro to Physics",
      category: "Sciences",
      type: "video",
      level: "Intermediate",
      icon: "fas fa-atom",
      badge: "Video Series",
      description: "Understand the fundamental forces that shape our universe.",
      content: [
        "Unit 1: Motion and Forces",
        "Unit 2: Energy and Work",
        "Unit 3: Momentum",
        "Unit 4: Thermodynamics"
      ]
    },
    {
      id: 5,
      title: "Spanish for Beginners",
      category: "Languages",
      type: "video",
      level: "Beginner",
      icon: "fas fa-language",
      badge: "Interactive",
      description: "Start speaking Spanish with everyday conversational phrases.",
      content: [
        "Lesson 1: Greetings & Introductions",
        "Lesson 2: Numbers & Colors",
        "Lesson 3: Ordering Food",
        "Lesson 4: Travel Essentials"
      ]
    },
    {
      id: 6,
      title: "Organic Chemistry",
      category: "Sciences",
      type: "download",
      level: "Advanced",
      icon: "fas fa-flask",
      badge: "Notes PDF",
      description: "Detailed reaction mechanisms and study guides for O-Chem.",
      content: [
        "Topic 1: Structure & Bonding",
        "Topic 2: Alkanes & Cycloalkanes",
        "Topic 3: Stereochemistry",
        "Topic 4: Nucleophilic Substitution"
      ]
    },
    {
      id: 7,
      title: "Philosophy: The Classics",
      category: "Humanities",
      type: "video",
      level: "Intermediate",
      icon: "fas fa-book-open",
      badge: "Audio & Video",
      description: "Explore the minds of Plato, Aristotle, and Descartes.",
      content: [
        "Lecture 1: The Republic (Plato)",
        "Lecture 2: Nicomachean Ethics (Aristotle)",
        "Lecture 3: Meditations (Descartes)",
        "Lecture 4: Beyond Good and Evil (Nietzsche)"
      ]
    },
    {
      id: 8,
      title: "Data Structures & Algos",
      category: "Computer Science",
      type: "video",
      level: "Advanced",
      icon: "fas fa-project-diagram",
      badge: "Lecture Series",
      description: "Essential computer science concepts for technical interviews.",
      content: [
        "Part 1: Arrays & Linked Lists",
        "Part 2: Stacks & Queues",
        "Part 3: Trees & Graphs",
        "Part 4: Sorting Algorithms"
      ]
    }
  ];

  const categories = ["All", "Math & Logic", "Computer Science", "Languages", "Humanities", "Sciences"];

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      id="dashboard"
      className={`page-section ${isActive ? "active" : ""}`}
    >
      <div className="container">

        {/* --- Adaptive Hero Section --- */}
        {/* ... (Hero content from previous steps mostly unchanged in logic, keeping as is) ... */}

        {/* 1. Guest / Logged Out State */}
        {userState === 'guest' && (
          <div className="dashboard-hero guest-mode">
            <h1>Unlock Your Potential with Free, World-Class Education.</h1>
            <p style={{ color: 'var(--text-muted)' }}>
              Access 1000+ courses in Math, Science, and Tech.
              No fees, just learning. Structured for your success.
            </p>
            <div className="guest-actions">
              <button className="btn btn-primary btn-lg">Start Learning Free</button>
              <button className="btn btn-secondary btn-lg">Explore Subjects</button>
            </div>
          </div>
        )}

        {/* 3. Returning User State (The Active Dashboard) */}
        {userState === 'returning' && (
          <>
            {/* Welcome Header */}
            <div style={{ marginBottom: '2rem', marginTop: '1rem' }}>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Welcome back, {user?.fullName || "Student"}!</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
                You've active for <strong>3 days</strong> in a row. Let's keep the streak alive.
              </p>
            </div>

            {/* Dashboard Hero: Active Course vs Empty State */}
            {false ? ( // Change 'false' to 'activeCourse' check in future
              <div className="dashboard-hero">
                {/* ... (Active Course Content) ... */}
              </div>
            ) : (
              <div className="dashboard-hero new-user-mode">
                <div>
                  <h1 style={{ marginBottom: '1rem' }}>Ready to start learning?</h1>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '500px' }}>
                    Explore our catalog of courses or search for a specific topic to begin your journey.
                  </p>
                  <button className="btn btn-primary btn-lg" onClick={() => setSelectedCategory("Computer Science")}>
                    Browse Courses
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Subject Tabs Section */}
        <div className="section-header" style={{ marginTop: '3rem' }}>
          <h2>Popular Subjects</h2>
        </div>

        <div className="subject-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`subject-tab ${selectedCategory === cat ? "active" : ""}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dynamic Course Grid */}
        <div className="section-header">
          <h2>{selectedCategory === "All" ? "Recommended For You & Trending" : `${selectedCategory} Courses`}</h2>
        </div>

        <div className="grid">
          {filteredCourses.map((course) => (
            <div key={course.id} className={`card ${course.type}`}>
              <div className="card-image">
                <i className={course.icon} />
                <div className="card-badges">
                  <span className="badge">
                    <i className={course.type === 'video' ? "fas fa-video" : "fas fa-file-alt"} /> {course.badge}
                  </span>
                  <span className={`badge difficulty`}>{course.level}</span>
                </div>
                <FavoriteButton id={course.id} type={course.type as 'video' | 'download'} />
              </div>
              <div className="card-body">
                <h3 className="card-title">{course.title}</h3>
                <div className="card-tags">
                  <span className="tag">{course.category.split(' & ')[0]}</span>
                  <span className="tag">{course.level}</span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                  {course.description}
                </p>
                <div className="card-footer">
                  <button
                    className="card-btn btn-offline-mode"
                    type="button"
                    onClick={(e) => handleOpenPopover(e, course)}
                  >
                    <i className="fas fa-download icon-main" />
                    <i className="fas fa-plane icon-hover" />
                    <span>Save for Offline</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }} />
              <p>No courses found in this category yet. Check back soon!</p>
            </div>
          )}
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

      {/* Course Details Popover */}
      {selectedCourse && popoverPosition && (
        <div
          className="popover-overlay"
          onClick={() => setSelectedCourse(null)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'transparent', zIndex: 1999 // Invisible overlay to catch clicks outside
          }}
        >
          <div
            className="popover-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            style={{
              position: 'fixed',
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
              transform: 'translate(-50%, -100%) translateY(-10px)', // Move up and center
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              padding: '1.5rem',
              borderRadius: '1rem',
              width: '320px',
              maxWidth: '90vw',
              zIndex: 2000,
              animation: 'popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {/* Arrow pointer */}
            <div style={{
              position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)',
              width: '16px', height: '16px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)'
            }} />

            <button
              onClick={() => setSelectedCourse(null)}
              style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'transparent', border: 'none', fontSize: '1rem', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <i className="fas fa-times" />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem', flexShrink: 0 }}>
                <i className={selectedCourse.icon} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.2 }}>{selectedCourse.title}</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{selectedCourse.level}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Syllabus / Content</h4>
              <ul style={{ paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                {selectedCourse.content.map((item: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{item}</li>
                ))}
              </ul>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => {
              alert(`Starting download/course: ${selectedCourse.title}`);
              setSelectedCourse(null);
            }}>
              <i className="fas fa-play" style={{ marginRight: '8px' }} /> Access Content Now
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default DashboardSection;
