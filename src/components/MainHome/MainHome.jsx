import React, {useState, useEffect} from "react";
import "./MainHome.css";
import Tracker from "../Tracker/Tracker";
import AllActivities from "../ActivityCard/AllActivities";
import MyPortfolio from "../MyPortfolio/MyPortfolio";
import MyExperienceStatus from "../Status/MyExperienceStatus";
import GoalStatus from "../Status/GoalStatus";
import ActivityNote from "../Status/ActivityNote";
import HomeTracker from "../HomeTracker/HomeTracker";
import { fetchMyProfile } from "../../api.js";  

const MainHome = ({ isPanelCollapsed, onGoToChooseOption }) => {
  const [userName, setUserName] = useState("");  

  useEffect(() => {
    fetchMyProfile()
      .then(data => setUserName(data.full_name || ""))  // ✅ 수정!
      .catch(err => console.error("프로필 조회 실패:", err));
  }, []);
  
  return (
    <div className="main-home">
      {/* 환영 메시지 */}
      <div className="welcome-section">
        <h1 className="welcome-title">
          {userName ? `${userName}님, 안녕하세요` : "안녕하세요"}
          </h1>
        <p className="welcome-subtitle">
          오늘 기록한 경험이, 내일의 포트폴리오가 돼요
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
    {/* <Tracker /> */}

    {/* Status 컴포넌트들 */}
    <div className="status-container">
        <MyExperienceStatus isPanelCollapsed={isPanelCollapsed} 
        onGoToChooseOption={onGoToChooseOption}/>
        <GoalStatus isPanelCollapsed={isPanelCollapsed} />
    </div>

    <div className="status-container2">
    <ActivityNote isPanelCollapsed={isPanelCollapsed} />
    </div>
    
    {/* 아카이브 */}
    <div className="status-container2">
    <HomeTracker isPanelCollapsed={isPanelCollapsed} 
    onGoToChooseOption={onGoToChooseOption}/>
    </div>
    
    {/* 2열 레이아웃: 왼쪽 모든 활동, 오른쪽 내 포트폴리오 
    이거 디자인 수정돼서 안쓸 것 같은데 혹시 몰라서 남겨둠 */}
    {/* <div className="tracker-content">
        <div className="tracker-column">
          <AllActivities />
        </div>

        <div className="tracker-column">
          <MyPortfolio />
        </div>
      </div> */}
    </div>    
  
  );
};

export default MainHome;