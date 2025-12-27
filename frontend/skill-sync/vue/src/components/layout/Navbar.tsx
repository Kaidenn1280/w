import { useState, useRef, useEffect } from "react";
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
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
};

const Navbar = ({
  activePage,
  darkMode,
  onNavClick,
  onToggleTheme,
  onOpenLogin,
  onOpenProfile,
  searchQuery,
  onSearchChange,
}: NavbarProps) => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);

  // Refs for click outside detection
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      // Check Mobile Menu Area (Toggle + Links)
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
      // Check Settings Menu Area (Toggle + Dropdown)
      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setIsMobileSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleLinkClick = (page: PageId) => {
    onNavClick(page);
    setIsMobileMenuOpen(false); // Close menu on selection
  };

  // Toggle handlers that close the OTHER menu to prevent overlapping
  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) setIsMobileSettingsOpen(false);
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSettings = () => {
    if (!isMobileSettingsOpen) setIsMobileMenuOpen(false);
    setIsMobileSettingsOpen(!isMobileSettingsOpen);
  };

  return (
    <header>
      <div className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} ref={mobileMenuRef}>
          {/* Mobile Menu Toggle & Dropdown Container */}
          <div className="mobile-menu-wrapper">
            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>

            {/* Navigation Links - Toggled on mobile */}
            <ul className={`nav-links ${isMobileMenuOpen ? "mobile-open" : ""}`}>
              <li>
                <a
                  href="#"
                  className={`nav-link ${activePage === "dashboard" ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); handleLinkClick("dashboard"); }}
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`nav-link ${activePage === "videos" ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); handleLinkClick("videos"); }}
                >
                  Video Lesson
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`nav-link ${activePage === "downloads" ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); handleLinkClick("downloads"); }}
                >
                  Downloads
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className={`nav-link ${activePage === "community" ? "active" : ""}`}
                  onClick={(e) => { e.preventDefault(); handleLinkClick("community"); }}
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Mobile Settings Toggle Area */}
          <div style={{ position: 'relative' }} ref={settingsRef}>
            <button
              className="mobile-settings-toggle"
              onClick={toggleSettings}
              aria-label="Open settings"
            >
              <i className="fas fa-cog" />
            </button>

            {/* Mobile Settings Dropdown */}
            {isMobileSettingsOpen && (
              <div className="mobile-settings-dropdown">
                <div className="mobile-setting-item" onClick={onToggleTheme}>
                  <span>Appearance</span>
                  <button className="theme-toggle-mini">
                    <i className={darkMode ? "fas fa-sun" : "fas fa-moon"} />
                  </button>
                </div>

                <a
                  href="#"
                  className={`mobile-setting-item ${activePage === "favorites" ? "active" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick("favorites");
                    setIsMobileSettingsOpen(false);
                  }}
                >
                  <span>Favorites</span>
                  <i className="far fa-heart" />
                </a>

                <div className="mobile-setting-item-Login">
                  {isAuthenticated ? (
                    <ProfileDropdown onOpenProfile={onOpenProfile || (() => { })} />
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={() => { onOpenLogin(); setIsMobileSettingsOpen(false); }}>
                      Login
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

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
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-actions">
          {/* Desktop Actions (Hidden on Mobile) */}
          <div className="desktop-actions">
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
              className={`nav-link favorites-link ${activePage === "favorites" ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                onNavClick("favorites");
              }}
            >
              <i className="far fa-heart" /> Favorites
            </a>

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
      </div>
    </header>
  );
};

export default Navbar;
