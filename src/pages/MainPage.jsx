import React, { useState, useEffect } from "react";
import LeftPanel from "./../components/LeftPanel/LeftPanel";
import MainHome from "./../components/MainHome/MainHome";
import ChooseOption from "./../components/ChooseOption/ChooseOption";
import MakingPortfolio from "./../components/MakingPortfolio/MakingPortfolio"; // ✅ 추가
import "./../App.css";
import ProfileCard from "../components/Profile/ProfileCard";
import banner from "../assets/icons/banner.png";
import avatar from "../assets/icons/avatar.png";
import Activity from "./../components/Activity/Activity";
import Newsletter from "./../components/Newsletter/Newsletter";
import { useNavigate } from "react-router-dom";

// 로고 이미지 import
import saraminLogo from "../assets/logos/saramin.png";
import linkcareerLogo from "../assets/logos/linkcareer.png";
import wantedLogo from "../assets/logos/wanted.png";
import catchLogo from "../assets/logos/catch.png";

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
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [triggerProfileEdit, setTriggerProfileEdit] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]); // ✅ 선택된 태그 저장
  const navigate = useNavigate();

  // ChooseOption 페이지로 이동하는 함수
  const handleGoToChooseOption = () => {
    setCurrentPage("chooseOption");
  };

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

  const handleOpenProfileSettings = () => {
    setTriggerProfileEdit(true);
  };

  // ✅ 포트폴리오 페이지로 이동 (MainPage 내부)
  const handleGoToPortfolio = (tags) => {
    console.log('🎯 MainPage - 포트폴리오로 이동:', tags);
    setSelectedTags(tags);
    setCurrentPage("makingPortfolio");
  };

  // ✅ 경험 페이지로 이동 (추후 구현)
  const handleGoToExperience = (tags) => {
    console.log('경험 페이지로 이동:', tags);
    setSelectedTags(tags);
    // setCurrentPage("experience");
  };

  // ✅ 스펙 페이지로 이동 (추후 구현)
  const handleGoToSpec = (tags) => {
    console.log('스펙 페이지로 이동:', tags);
    setSelectedTags(tags);
    // setCurrentPage("spec");
  };

  useEffect(() => {
    if (isProfileSettingsOpen) {
      setIsPanelCollapsed(true);
    }
  }, [isProfileSettingsOpen]);

  const renderMainContent = () => {
    if (currentPage === "home") {
      return <MainHome isPanelCollapsed={isPanelCollapsed} 
      onGoToChooseOption={handleGoToChooseOption}/>;
    } else if (currentPage === "chooseOption") {
      return (
        <ChooseOption 
          onGoToActivity={handleGoToActivity}
          onGoToPortfolio={handleGoToPortfolio}  // ✅ 추가
          onGoToExperience={handleGoToExperience}  // ✅ 추가
          onGoToSpec={handleGoToSpec}  // ✅ 추가
        />
      );
    } else if (currentPage === "makingPortfolio") {
      return (
        <MakingPortfolio 
          selectedTags={selectedTags}
          onCancel={() => setCurrentPage("chooseOption")}  // ✅ 취소 시 ChooseOption으로
        />
      );
    } else if (currentPage === "Activity") {
      return <Activity />;
    }
    return null;
  };

  const companyLogos = [
    { name: "saramin", logo: saraminLogo, url: "https://www.saramin.co.kr" },
    { name: "LINKareer", logo: linkcareerLogo, url: "https://www.linkareer.com" },
    { name: "wanted", logo: wantedLogo, url: "https://www.wanted.co.kr" },
    { name: "CATCH", logo: catchLogo, url: "https://www.catch.co.kr" },
  ];

  return (
    <div className="App" style={{backgroundColor: "#F7F7F7"}}>
      <LeftPanel
        isCollapsed={isPanelCollapsed}
        onToggle={handlePanelToggle}
        onCreateNew={handleCreateNew}
        onHomeClick={handleHomeClick}
        onLogout={onLogout}
        isProfileSettingsOpen={isProfileSettingsOpen}
        onOpenProfileSettings={handleOpenProfileSettings} 
      />
      <div
        className="main-content-wrapper"
        style={{
          marginLeft: isPanelCollapsed ? "60px" : "194px",
          width: `calc(100% - ${isPanelCollapsed ? "60px" : "194px"})`,
          minHeight: "100vh", // height에서 minHeight로 변경
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          backgroundColor: "#F7F7F7",
          transition: "all 0.3s ease",
          overflowY: "auto", // 전체 스크롤
          overflowX: "hidden",
        }}
      >
        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            // padding: "24px",
            marginLeft: "14px",
            paddingTop: "24px",
            flex: "1 1 auto",
            // minHeight 제거! (내부 스크롤 방지)
          }}
        >
          <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex" }}>
            {renderMainContent()}
          </div>

          {currentPage === "home" && (
            <div
              style={{
                width: "340px",
                flex: "0 0 340px",
                marginLeft: "auto",
                display: "flex",
                flexDirection: "column",
                // gap: "16px",
                position: "sticky",
                // maxHeight 제거! (독립 스크롤 방지)
                // overflowY 제거! (독립 스크롤 방지)
              }}
            >
              <ProfileCard
                {...profile}
                isPanelCollapsed={isPanelCollapsed}  // 추가
                socials={profile.socials}
                onProfileUpdate={(data) =>
                  setProfile((prev) => ({ ...prev, ...data }))
                }
                onSettingsOpenChange={setIsProfileSettingsOpen}
                triggerEdit={triggerProfileEdit}
                onEditTriggered={() => setTriggerProfileEdit(false)}
              />
              <Newsletter />
            </div>
          )}
        </div>

        {/* 기업 로고 섹션 - MainHome과 동일한 레이아웃 구조 */}
        {currentPage === "home" && (
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginLeft: "24px",
              paddingBottom: "32px",
              marginTop: "auto",
            }}
          >
            {/* MainHome과 동일한 flex: 1 영역 */}
            <div 
              style={{ 
                flex: "1 1 auto", 
                minWidth: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "32px 24px",
              }}
            >
              {companyLogos.map((company) => (
                <a
                  key={company.name}
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={company.logo}
                    alt={company.name}
                    style={{
                      height: "72px",
                      objectFit: "contain",
                    }}
                  />
                </a>
              ))}
            </div>

            {/* 프로필바 자리 확보 (빈 공간) */}
            <div style={{ width: "340px", flex: "0 0 340px" }} />
          </div>
        )}
      </div>
    </div>
  );
}