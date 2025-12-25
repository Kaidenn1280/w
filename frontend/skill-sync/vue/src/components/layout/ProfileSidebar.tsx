import { useAuth } from "../../context/AuthContext";
import "../../styles/ProfileSidebar.css";

interface ProfileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileSidebar = ({ isOpen, onClose }: ProfileSidebarProps) => {
    const { user } = useAuth();

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

    // Format date for display
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`profile-sidebar-overlay ${isOpen ? "visible" : ""}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`profile-sidebar ${isOpen ? "open" : ""}`}>
                {/* Close Button */}
                <button className="sidebar-close" onClick={onClose}>
                    <i className="fas fa-times" />
                </button>

                {/* Header with Avatar */}
                <div className="sidebar-header">
                    <div className="sidebar-avatar">
                        {getInitials(user.fullName)}
                    </div>
                    <h2 className="sidebar-name">{user.fullName}</h2>
                    <p className="sidebar-email">{user.email}</p>
                </div>

                {/* Profile Details */}
                <div className="sidebar-content">
                    {/* Address Section */}
                    <div className="sidebar-section">
                        <div className="section-header">
                            <i className="fas fa-map-marker-alt" />
                            <h3>Address</h3>
                        </div>
                        <div className="section-content address-content">
                            {user.address ? (
                                <>
                                    {user.address.street && (
                                        <p className="address-line">{user.address.street}</p>
                                    )}
                                    <p className="address-line">
                                        {[user.address.city, user.address.stateProvince]
                                            .filter(Boolean)
                                            .join(", ")}
                                    </p>
                                    <p className="address-line">
                                        {[user.address.postalCode, user.address.country]
                                            .filter(Boolean)
                                            .join(" - ")}
                                    </p>
                                </>
                            ) : (
                                <p className="no-data">No address provided</p>
                            )}
                        </div>
                    </div>

                    {/* Account Info Section */}
                    <div className="sidebar-section">
                        <div className="section-header">
                            <i className="fas fa-calendar-alt" />
                            <h3>Account Information</h3>
                        </div>
                        <div className="section-content">
                            <div className="info-row">
                                <span className="info-label">Member Since</span>
                                <span className="info-value">{formatDate(user.createdAt)}</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Last Login</span>
                                <span className="info-value">{formatDate(user.lastLoginAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    {user.loginHistory && user.loginHistory.length > 0 && (
                        <div className="sidebar-section">
                            <div className="section-header">
                                <i className="fas fa-history" />
                                <h3>Recent Activity</h3>
                            </div>
                            <div className="section-content">
                                <ul className="activity-list">
                                    {user.loginHistory.slice(0, 5).map((entry, index) => (
                                        <li key={index} className="activity-item">
                                            <div className="activity-icon">
                                                <i className="fas fa-sign-in-alt" />
                                            </div>
                                            <div className="activity-details">
                                                <span className="activity-action">Logged in</span>
                                                <span className="activity-meta">
                                                    {entry.device || "Unknown device"} • {formatDate(entry.timestamp)}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default ProfileSidebar;
