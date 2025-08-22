import React, { useState } from 'react';
import LeftPanel from "./../components/LeftPanel/LeftPanel";
import MainHome from "./../components/MainHome/MainHome";
import ChooseOption from "./../components/ChooseOption/ChooseOption";
import './../App.css'; // 스타일 적용

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
        }}
      >
        {renderMainContent()} {/* 조건부 렌더링 */}
      </div>
    </div>
  );
}