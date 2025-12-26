import { useEffect, useState } from "react";
import "../styles/Home.css";
import LoginModal from "../components/ui/LoginModal";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProfileSidebar from "../components/layout/ProfileSidebar";
import DashboardSection from "../components/Sections/Dashboard";
import Video from "../components/Sections/Video.tsx";
import DownloadsSection from "../components/Sections/Downloads";
import FavoritesSection from "../components/Sections/Favorites";
import CommunitySection from "../components/Sections/Community";
import SubmitSection from "../components/Sections/Submit";
import type { PageId } from "../Types/navigation";
import GeminiChatbot from "../components/chatbot/GeminiChatbot";

const OpenAccess = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return (
      typeof window !== "undefined" &&
      localStorage.getItem("theme") === "dark"
    );
  });

  const [activePage, setActivePage] = useState<PageId>("dashboard");
  const [showLogin, setShowLogin] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavClick = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleThemeToggle = () => {
    setDarkMode((prev) => !prev);
  };

  const handleOpenLogin = () => setShowLogin(true);
  const handleCloseLogin = () => setShowLogin(false);
  const handleOpenProfile = () => setShowProfile(true);
  const handleCloseProfile = () => setShowProfile(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <>
      <Navbar
        activePage={activePage}
        darkMode={darkMode}
        onNavClick={handleNavClick}
        onToggleTheme={handleThemeToggle}
        onOpenLogin={handleOpenLogin}
        onOpenProfile={handleOpenProfile}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <DashboardSection
        isActive={activePage === "dashboard"}
        onGoToSubmit={() => handleNavClick("submit")}
        searchQuery={searchQuery}
      />
      <Video isActive={activePage === "videos"} />
      <DownloadsSection isActive={activePage === "downloads"} />
      <FavoritesSection isActive={activePage === "favorites"} />
      <CommunitySection isActive={activePage === "community"} />
      <SubmitSection isActive={activePage === "submit"} />

      <Footer />

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={handleCloseLogin} />}

      {/* Profile Sidebar */}
      <ProfileSidebar isOpen={showProfile} onClose={handleCloseProfile} />

      {/* Chatbot */}
      <div className="chatbot-wrapper">
        <GeminiChatbot />
      </div>
    </>
  );
};

export default OpenAccess;
