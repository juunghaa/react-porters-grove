import React from "react";
import "./MainHome.css";
import Tracker from "../Tracker/Tracker";
import AllActivities from "../ActivityCard/AllActivities";
import MyPortfolio from "../MyPortfolio/MyPortfolio";

const MainHome = () => {
  return (
    <div className="main-home">
      {/* 환영 메시지 */}
      <div className="welcome-section">
        <h1 className="welcome-title">김포트님,</h1>
        <p className="welcome-subtitle">
          하나씩 쌓여 쓰다 보면, 나만의 이야기가 완성돼요.
        </p>
      </div>

      {/* 배너형 카드 */}
      {/* <div className="cta-card">
        <div className="cta-content">
          <h2 className="cta-title">지금 포트폴리오가 필요한 OO님,</h2>
          <p className="cta-description">회고로 한 걸음 성장해보세요.</p>
          <button className="cta-button">
            <span className="plus-icon">+</span>새 포트폴리오 만들기
          </button>
        </div>
      </div> */}

    {/* Tracker 헤더 */}
    <Tracker />


    {/* 2열 레이아웃: 왼쪽 모든 활동, 오른쪽 내 포트폴리오 */}
    <div className="tracker-content">
        {/* 왼쪽: 모든 활동 */}
        <div className="tracker-column">
          <AllActivities />
        </div>

        {/* 오른쪽: 내 포트폴리오 */}
        <div className="tracker-column">
          <MyPortfolio />
        </div>
      </div>
    </div>
    
  );
};

export default MainHome;
