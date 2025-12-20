import React, { useState, useEffect } from "react";
import LeftPanel from "./../components/LeftPanel/LeftPanel";
import MainHome from "./../components/MainHome/MainHome";
import ChooseOption from "./../components/ChooseOption/ChooseOption";
import MakingPortfolio from "./../components/MakingPortfolio/MakingPortfolio";
import MakingPortfolioNext from "./../components/MakingPortfolio/MakingPortfolioNext";
import MakingPortfolioFinal from "./../components/MakingPortfolio/MakingPortfolioFinal";
import MakingPortfolioComplete from "./../components/MakingPortfolio/MakingPortfolioComplete";
import PortfolioViewer from "./../components/PortfolioViewer/PortfolioViewer";
import ArchivePage from "./../components/HomeTracker/ArchivePage"; // ⭐ HomeTracker 폴더
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
  const [selectedTags, setSelectedTags] = useState([]);
  const navigate = useNavigate();
  const [selectedPortfolioItems, setSelectedPortfolioItems] = useState([]);
  const [createdPortfolioData, setCreatedPortfolioData] = useState(null);

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

  // ⭐ 아카이브 페이지로 이동
  const handleArchiveClick = () => {
    setCurrentPage("archive");
  };

  const handleGoToActivity = () => {
    setCurrentPage("Activity");
  };

  const handleOpenProfileSettings = () => {
    setTriggerProfileEdit(true);
  };

  // ✅ 포트폴리오 Step 1으로 이동
  const handleGoToPortfolio = (tags) => {
    console.log('🎯 MainPage - 포트폴리오 Step 1로 이동:', tags);
    setSelectedTags(tags);
    setCurrentPage("makingPortfolio");
  };

  // ✅ 경험 페이지로 이동 (추후 구현)
  const handleGoToExperience = (tags) => {
    console.log('경험 페이지로 이동:', tags);
    setSelectedTags(tags);
  };

  // ✅ 스펙 페이지로 이동 (추후 구현)
  const handleGoToSpec = (tags) => {
    console.log('스펙 페이지로 이동:', tags);
    setSelectedTags(tags);
  };

  // ===== 포트폴리오 5단계 플로우 =====
  
  // Step 1 -> Step 2
  const handleGoToPortfolioStep2 = (selectedItems) => {
    console.log('✅ Step 1 완료 - Step 2로 이동');
    setSelectedPortfolioItems(selectedItems);
    setCurrentPage("makingPortfolioNext");
  };
  
  // Step 2 -> Step 1
  const handleBackToPortfolioStep1 = () => {
    console.log('⬅️ Step 2 -> Step 1');
    setCurrentPage("makingPortfolio");
  };
  
  // Step 2 -> Step 3
  const handleGoToPortfolioStep3 = (data) => {
    console.log('✅ Step 2 완료 - Step 3으로 이동');
    console.log('선택된 태그:', data.tags);
    setSelectedTags(data.tags);
    setCurrentPage("makingPortfolioFinal");
  };

  // Step 3 -> Step 2
  const handleBackToPortfolioStep2 = () => {
    console.log('⬅️ Step 3 -> Step 2');
    setCurrentPage("makingPortfolioNext");
  };
  
  // Step 3 -> Step 4 (완료 페이지)
  const handleCompletePortfolio = (portfolioData) => {
    console.log('🎉 포트폴리오 생성 완료!');
    console.log('전체 데이터:', portfolioData);
    
    setCreatedPortfolioData(portfolioData);
    setCurrentPage("portfolioComplete");
  };

  // Step 4 -> Step 5 (뷰어로 자동 이동)
  const handleGoToPortfolioViewer = () => {
    console.log('📋 포트폴리오 뷰어로 이동');
    setCurrentPage("portfolioViewer");
  };

  // 뷰어 닫기
  const handleClosePortfolioViewer = () => {
    console.log('뷰어 닫기 - 홈으로 이동');
    setCurrentPage("home");
    setCreatedPortfolioData(null);
    setSelectedPortfolioItems([]);
    setSelectedTags([]);
  };

  // 포트폴리오 저장 성공
  const handleSaveSuccess = (savedPortfolio) => {
    console.log('포트폴리오 저장 성공:', savedPortfolio);
  };

  useEffect(() => {
    if (isProfileSettingsOpen) {
      setIsPanelCollapsed(true);
    }
  }, [isProfileSettingsOpen]);

  // Complete 페이지에서 자동으로 뷰어로 이동
  useEffect(() => {
    if (currentPage === "portfolioComplete") {
      const timer = setTimeout(() => {
        handleGoToPortfolioViewer();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [currentPage]);

  const renderMainContent = () => {
    // ⭐ 아카이브 페이지
    if (currentPage === "archive") {
      return (
        <ArchivePage 
          isPanelCollapsed={isPanelCollapsed}
          onGoToChooseOption={handleGoToChooseOption}
        />
      );
    }

    if (currentPage === "home") {
      return (
        <MainHome 
          isPanelCollapsed={isPanelCollapsed} 
          onGoToChooseOption={handleGoToChooseOption}
        />
      );
    } 
    else if (currentPage === "chooseOption") {
      return (
        <ChooseOption 
          onGoToActivity={handleGoToActivity}
          onGoToPortfolio={handleGoToPortfolio}
          onGoToExperience={handleGoToExperience}
          onGoToSpec={handleGoToSpec}
        />
      );
    } 
    // ===== Step 1: 경험 선택 =====
    else if (currentPage === "makingPortfolio") {
      return (
        <MakingPortfolio 
          selectedTags={selectedTags}
          onCancel={() => setCurrentPage("chooseOption")}
          onNext={handleGoToPortfolioStep2}
        />
      );
    } 
    // ===== Step 2: 태그 선택 =====
    else if (currentPage === "makingPortfolioNext") {
      return (
        <MakingPortfolioNext 
          selectedItems={selectedPortfolioItems}
          onBack={handleBackToPortfolioStep1}
          onComplete={handleGoToPortfolioStep3}
        />
      );
    }
    // ===== Step 3: 자기소개 작성 =====
    else if (currentPage === "makingPortfolioFinal") {
      return (
        <MakingPortfolioFinal 
          selectedItems={selectedPortfolioItems}
          selectedTags={selectedTags}
          onBack={handleBackToPortfolioStep2}
          onComplete={handleCompletePortfolio}
        />
      );
    }
    // ===== Step 4: 완료 페이지 (2초 후 자동 이동) =====
    else if (currentPage === "portfolioComplete") {
      return (
        <MakingPortfolioComplete 
          onGoHome={handleGoToPortfolioViewer}
        />
      );
    }
    // ===== Step 5: 포트폴리오 뷰어 =====
    else if (currentPage === "portfolioViewer") {
      return (
        <PortfolioViewer 
          portfolioData={createdPortfolioData}
          onClose={handleClosePortfolioViewer}
          onSaveSuccess={handleSaveSuccess}
        />
      );
    }
    else if (currentPage === "Activity") {
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

  // ⭐ 아카이브 페이지에서는 사이드바 숨김
  const showSidebar = currentPage === "home";

  return (
    <div className="App" style={{backgroundColor: "#F7F7F7"}}>
      <LeftPanel
        isCollapsed={isPanelCollapsed}
        onToggle={handlePanelToggle}
        onCreateNew={handleCreateNew}
        onHomeClick={handleHomeClick}
        onArchiveClick={handleArchiveClick}  // ⭐ 아카이브 핸들러 전달
        onLogout={onLogout}
        isProfileSettingsOpen={isProfileSettingsOpen}
        onOpenProfileSettings={handleOpenProfileSettings} 
      />
      <div
        className="main-content-wrapper"
        style={{
          marginLeft: isPanelCollapsed ? "60px" : "194px",
          width: `calc(100% - ${isPanelCollapsed ? "60px" : "194px"})`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          backgroundColor: "#F7F7F7",
          transition: "all 0.3s ease",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* 메인 콘텐츠 */}
        <div
          style={{
            display: "flex",
            gap: "24px",
            margin: "0 auto",
            paddingTop: currentPage === "archive" ? "0" : "24px",
            flex: "1 1 auto",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div style={{ 
            flex: "1 1 auto", 
            minWidth: 0, 
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}>
            {renderMainContent()}
          </div>

          {/* ⭐ 홈에서만 사이드바 표시 */}
          {showSidebar && (
            <div
              style={{
                width: "340px",
                flex: "0 0 340px",
                marginLeft: "auto",
                display: "flex",
                flexDirection: "column",
                position: "sticky",
              }}
            >
              <ProfileCard
                {...profile}
                isPanelCollapsed={isPanelCollapsed}
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

        {/* 기업 로고 섹션 */}
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
            <div style={{ width: "340px", flex: "0 0 340px" }} />
          </div>
        )}
      </div>
    </div>
  );
}