// src/components/layout/Navbar.tsx
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

  return (
    <header>
      <div className="navbar">
        <a
          href="#"
          className="logo"
          onClick={(e) => {
            e.preventDefault();
            onNavClick("dashboard");
          }}
        >
          <i className="fas fa-book-open" /> Open Access Learning
        </a>

        <div className="nav-center">
          <div className="global-search-bar">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Search textbooks, videos, subjects..."
            />
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "dashboard" ? "active" : ""
                }`}
              onClick={(e) => {
                e.preventDefault();
                onNavClick("dashboard");
              }}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "videos" ? "active" : ""
                }`}
              onClick={(e) => {
                e.preventDefault();
                onNavClick("videos");
              }}
            >
              Video Lesson
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "downloads" ? "active" : ""
                }`}
              onClick={(e) => {
                e.preventDefault();
                onNavClick("downloads");
              }}
            >
              Downloads
            </a>
          </li>
          <li>
            <a
              href="#"
              className={`nav-link ${activePage === "community" ? "active" : ""
                }`}
              onClick={(e) => {
                e.preventDefault();
                onNavClick("community");
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
          <a
            href="#"
            className={`nav-link ${activePage === "favorites" ? "active" : ""
              }`}
            onClick={(e) => {
              e.preventDefault();
              onNavClick("favorites");
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
