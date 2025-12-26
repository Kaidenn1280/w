import { useState } from "react";
import type { PageId } from "../../Types/navigation";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

type NavbarProps = {
  activePage: PageId;
  darkMode: boolean;
  onNavClick: (page: PageId) => void;
  onToggleTheme: () => void;
  onOpenLogin: () => void;
  onOpenProfile?: () => void;
};

const Navbar = ({
  activePage,
  darkMode,
  onNavClick,
  onToggleTheme,
  onOpenLogin,
  onOpenProfile,
}: NavbarProps) => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (page: PageId) => {
    onNavClick(page);
    setIsMobileMenuOpen(false); // Close menu on selection
  };

  return (
    <header>
      <div className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
          </button>

          <a
            href="#"
            className="logo"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("dashboard");
            }}
          >
            <i className="fas fa-book-open" /> Open Access Learning
          </a>
        </div>

        <div className="nav-center">
          <div className="global-search-bar">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Navigation Links - Toggled on mobile */}
        <ul className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("dashboard");
              }}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "videos" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("videos");
              }}
            >
              Video Lesson
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "downloads" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("downloads");
              }}
            >
              Downloads
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "community" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick("community");
              }}
            >
              Community
            </a>
          </li>
        </ul>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            id="theme-toggle"
            title="Toggle Dark Mode"
            type="button"
            onClick={onToggleTheme}
          >
            <i className={darkMode ? "fas fa-sun" : "fas fa-moon"} />
          </button>

          {/* Favorites - Hidden in main nav on mobile, usually kept in bar or moved to menu. Keeping here for now. */}
          <a
            href="#"
            className={`nav-link favorites-link ${activePage === "favorites" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("favorites");
            }}
          >
            <i className="far fa-heart" /> Favorites
          </a>

          {/* Conditional rendering: Show profile dropdown if authenticated, otherwise show login button */}
          {isAuthenticated ? (
            <ProfileDropdown
              onOpenProfile={onOpenProfile || (() => { })}
            />
          ) : (
            <button
              className="btn btn-primary"
              type="button"
              onClick={onOpenLogin}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
