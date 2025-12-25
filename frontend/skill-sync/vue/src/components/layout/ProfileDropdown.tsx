import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ProfileDropdown.css";

interface ProfileDropdownProps {
    onOpenProfile: () => void;
    onOpenSettings?: () => void;
}

const ProfileDropdown = ({ onOpenProfile, onOpenSettings }: ProfileDropdownProps) => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) return null;

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    // Format address for display
    const formatAddress = () => {
        if (!user.address) return "No address";
        const { city, country } = user.address;
        return [city, country].filter(Boolean).join(", ") || "No address";
    };

    const handleLogout = () => {
        setIsOpen(false);
        logout();
    };

    return (
        <div className="profile-dropdown-container" ref={dropdownRef}>
            {/* Trigger Button - Shows user info */}
            <button
                className="profile-trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <div className="profile-avatar">
                    {getInitials(user.fullName)}
                </div>
                <div className="profile-info-mini">
                    <span className="profile-name-mini">{user.fullName}</span>
                    <span className="profile-location-mini">{formatAddress()}</span>
                </div>
                <i className={`fas fa-chevron-${isOpen ? "up" : "down"} dropdown-arrow`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="profile-dropdown-menu">
                    <div className="dropdown-header">
                        <div className="dropdown-avatar">
                            {getInitials(user.fullName)}
                        </div>
                        <div className="dropdown-user-info">
                            <span className="dropdown-name">{user.fullName}</span>
                            <span className="dropdown-email">{user.email}</span>
                        </div>
                    </div>

                    <div className="dropdown-divider" />

                    <button
                        className="dropdown-item"
                        onClick={() => {
                            setIsOpen(false);
                            onOpenProfile();
                        }}
                    >
                        <i className="fas fa-user" />
                        <span>Profile</span>
                    </button>

                    {onOpenSettings && (
                        <button
                            className="dropdown-item"
                            onClick={() => {
                                setIsOpen(false);
                                onOpenSettings();
                            }}
                        >
                            <i className="fas fa-cog" />
                            <span>Settings</span>
                        </button>
                    )}

                    <div className="dropdown-divider" />

                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt" />
                        <span>Log out</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
