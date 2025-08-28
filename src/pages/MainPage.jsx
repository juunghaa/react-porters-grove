import React, { useState } from 'react';
import LeftPanel from "./../components/LeftPanel/LeftPanel";
import MainHome from "./../components/MainHome/MainHome";
import ChooseOption from "./../components/ChooseOption/ChooseOption";
import './../App.css'; // 스타일 적용
import ProfileCard from '../components/Profile/ProfileCard';
import githubIcon from "../assets/icons/Github.png";
import banner from "../assets/icons/banner.png";
import avatar from "../assets/icons/avatar.png";

export default function MainPage({ onLogout }) {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  const handlePanelToggle = () => {
    setIsPanelCollapsed(!isPanelCollapsed);
  };

  const handleCreateNew = () => {
    setCurrentPage("chooseOption"); // '새로 만들기' 버튼 클릭 시 페이지 전환
  };

  // '홈' 버튼 클릭 시 페이지를 MainHome으로 변경하는 함수
  const handleHomeClick = () => {
    setCurrentPage("home");
  };

  const renderMainContent = () => {
    if (currentPage === "home") {
      return <MainHome />;
    } else if (currentPage === "chooseOption") {
      return <ChooseOption />;
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
        <div style={{flex: "1 1 auto", minWidth: 0}}>
        {renderMainContent()} 
        </div>
        
        <div style={{ 
            width: "340px", 
            flex: "0 0 340px",
            position: "sticky", 
            top: "24px", 
            // transition: "margin-right 0.3s ease",
            }}>
        <ProfileCard
        bannerUrl={banner}
        avatarUrl={avatar}
        name="김포터"
        title="Motion designer"
        tagline="광주에 사는 냥집사 모션 디자이너"
        stats={{ activities: 18, followers: 22, scraps: 12 }}
        socials={[
        //   { name: "LinkedIn", href: "#", icon: "/assets/icons/linkedin.png" },
        //   { name: "GitHub", href: "https://github.com/...", icon: githubIcon },
        //   { name: "Dribbble", href: "#", icon: "/assets/icons/dribbble.png" }
        ]}
        // onOpen={() => console.log("프로필 상세로 이동")}
        onEdit={(section) => console.log("편집:", section)}
        />
        </div>
      </div>
    </div>

  );
}