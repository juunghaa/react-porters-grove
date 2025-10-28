import React, { useState, useEffect } from "react";
import LeftPanel from "./../components/LeftPanel/LeftPanel";
import MainHome from "./../components/MainHome/MainHome";
import ChooseOption from "./../components/ChooseOption/ChooseOption";
import "./../App.css";
import ProfileCard from "../components/Profile/ProfileCard";
import githubIcon from "../assets/icons/Github.png";
import banner from "../assets/icons/banner.png";
import avatar from "../assets/icons/avatar.png";
import Activity from "./../components/Activity/Activity";
import Newsletter from "./../components/Newsletter/Newsletter";

export default function MainPage({ onLogout }) {
  const [profile, setProfile] = useState({
    name: "김포터",
    title: "Motion designer",
    tagline: "광주에 사는 냥집사 모션 디자이너",
    avatarUrl: avatar,
    bannerUrl: banner,
    socials: [],
  });

  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false); // 추가

  const handlePanelToggle = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const handleCreateNew = () => {
    setCurrentPage("chooseOption");
  };

  const handleHomeClick = () => {
    setCurrentPage("home");
  };

  const handleGoToActivity = () => {
    setCurrentPage("Activity");
  };

  // 프로필 설정창이 열릴 때 LeftPanel 자동으로 접기
  useEffect(() => {
    if (isProfileSettingsOpen) {
      setIsPanelCollapsed(true);
    }
  }, [isProfileSettingsOpen]);

  const renderMainContent = () => {
    if (currentPage === "home") {
      return <MainHome />;
    } else if (currentPage === "chooseOption") {
      return <ChooseOption onGoToActivity={handleGoToActivity} />;
    } else if (currentPage === "Activity") {
      return <Activity />;
    }
    return null;
  };

  return (
    <div className="App">
      <LeftPanel
        isCollapsed={isPanelCollapsed}
        onToggle={handlePanelToggle}
        onCreateNew={handleCreateNew}
        onHomeClick={handleHomeClick}
        onLogout={onLogout}
      />
      <div
        className="main-content"
        style={{
          marginLeft: isPanelCollapsed ? "60px" : "240px",
          transition: "margin-left 0.3s ease",
          width: `calc(100% - ${isPanelCollapsed ? "60px" : "240px"})`,
          display: "flex",
          gap: "24px",
          padding: "24px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          {renderMainContent()}
        </div>

        {currentPage === "home" && (
          <div
            style={{
              width: "340px",
              flex: "0 0 340px",
              position: "sticky",
              top: "24px",
            }}
          >
            <ProfileCard
              {...profile}
              socials={profile.socials}
              onProfileUpdate={(data) =>
                setProfile((prev) => ({ ...prev, ...data }))
              }
              onSettingsOpenChange={setIsProfileSettingsOpen} // 추가
            />
            <Newsletter />
          </div>
        )}
      </div>
    </div>
  );
}
