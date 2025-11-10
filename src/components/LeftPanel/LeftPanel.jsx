// import React, { useState } from "react";
// import "./LeftPanel.css";

// import homeIcon from "../../assets/icons/Home.png";
// import plusIcon from "../../assets/icons/Plus.png";
// import archiveIcon from "../../assets/icons/Archive.png";
// import browseIcon from "../../assets/icons/Browse.png";
// import githubIcon from "../../assets/icons/Github.png";
// import settingsIcon from "../../assets/icons/Settings.png";
// import logoutIcon from "../../assets/icons/Logout.png";
// import logoIcon from "../../assets/icons/logo.png";
// import LogoutButton from "../Auth/LogoutButton";
// import cutlogo from "../../assets/icons/cutlogo.png";

// const LeftPanel = ({
//   isCollapsed,
//   onToggle,
//   onCreateNew,
//   onHomeClick,
//   onLogout,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isPinned, setIsPinned] = useState(false); // 고정 상태

//   // 실제로 펼쳐질지 여부: 고정되어 있거나, 닫힌 상태에서 hover 중일 때
//   const shouldExpand = !isCollapsed || isPinned || (isCollapsed && isHovered);

//   const handlePanelClick = () => {
//     if (isCollapsed && !isPinned) {
//       // 닫힌 상태에서 클릭하면 고정
//       setIsPinned(true);
//       onToggle(); // 열림 상태로 변경
//     }
//   };

//   const handleToggleClick = (e) => {
//     e.stopPropagation(); // 패널 클릭 이벤트와 분리
//     if (!isCollapsed) {
//       // 열린 상태에서 토글 버튼 누르면 고정 해제하고 닫기
//       setIsPinned(false);
//     }
//     onToggle();
//   };

//   return (
//     <div
//       className={`left-panel ${shouldExpand ? "" : "collapsed"}`}
//       onMouseEnter={() => isCollapsed && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={handlePanelClick}
//     >
//       <div className="panel-header">
//         <div className="logo-section">
//           <div className="logo">
//             <div className="logo-icon">
//               <img
//                 src={shouldExpand ? logoIcon : cutlogo}
//                 alt="아카이브"
//                 className={
//                   shouldExpand ? "logo-img" : "logo-img-collapsed"
//                 }
//               />
//             </div>
//           </div>
//           <button className="toggle-btn" onClick={handleToggleClick}>
//             <span className={`toggle-icon ${shouldExpand ? "" : "collapsed"}`}>
//               {shouldExpand ? "←" : "→"}
//             </span>
//           </button>
//         </div>
//       </div>

//       <div className="panel-content">
//         <nav className="navigation">
//           <div className="nav-item" onClick={onHomeClick}>
//             <div className="nav-icon">
//               <img src={homeIcon} alt="홈" className="icon-img" />
//             </div>
//             {shouldExpand && <span className="nav-text">홈</span>}
//           </div>

//           <div className="nav-item" onClick={onCreateNew}>
//             {" "}
//             {/*새 페이지 만들기 이동 */}
//             <div className="nav-icon">
//               <img src={plusIcon} alt="추가하기" className="icon-img" />
//             </div>
//             {shouldExpand && <span className="nav-text">새로 만들기</span>}
//           </div>

//           <div className="nav-item">
//             <div className="nav-icon">
//               <img src={archiveIcon} alt="아카이브" className="icon-img" />
//             </div>
//             {shouldExpand && <span className="nav-text">아카이브</span>}
//           </div>

//           <div className="nav-item">
//             <div className="nav-icon">
//               <img src={browseIcon} alt="둘러보기" className="icon-img" />
//             </div>
//             {shouldExpand && <span className="nav-text">둘러보기</span>}
//           </div>
//         </nav>

//         {shouldExpand && (
//           <div className="bottom-section">
//             <div className="github-status">
//               <div className="github-item">
//                 <div className="github-icon">
//                   <img src={githubIcon} alt="깃허브" className="icon-img" />
//                 </div>
//                 <span className="github-text">Github 연동 중</span>
//                 <div className="status-indicator active"></div>
//               </div>
//             </div>

//             <div className="settings-section">
//               <div className="nav-item">
//                 <div className="nav-icon">
//                   <img src={settingsIcon} alt="설정" className="icon-img" />
//                 </div>
//                 <span className="nav-text">설정</span>
//               </div>

//               <LogoutButton onLogout={onLogout} />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeftPanel;


import React, { useState, useEffect } from "react";
import "./LeftPanel.css";

import homeIcon from "../../assets/icons/Home.png";
import plusIcon from "../../assets/icons/Plus.png";
import archiveIcon from "../../assets/icons/Archive.png";
import trackerIcon from "../../assets/icons/Tracker.png";
import browseIcon from "../../assets/icons/Browse.png";
import githubIcon from "../../assets/icons/Github.png";
import settingsIcon from "../../assets/icons/Settings.png";
import logoutIcon from "../../assets/icons/Logout.png";
import logoIcon from "../../assets/icons/logo.png";
import LogoutButton from "../Auth/LogoutButton";
import cutlogo from "../../assets/icons/cutlogo.png";

const LeftPanel = ({
  isCollapsed,
  onToggle,
  onCreateNew,
  onHomeClick,
  onLogout,
  isProfileSettingsOpen, // 추가
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  // isCollapsed가 외부에서 true로 변경되면 isPinned와 isHovered 리셋
  useEffect(() => {
    if (isCollapsed) {
      setIsPinned(false);
      setIsHovered(false);
    }
  }, [isCollapsed]);

  const shouldExpand = !isCollapsed || isPinned || (isCollapsed && isHovered);

  const handlePanelClick = () => {
    if (isCollapsed && !isPinned) {
      setIsPinned(true);
      onToggle();
    }
  };

  const handleToggleClick = (e) => {
    e.stopPropagation();
    if (!isCollapsed) {
      setIsPinned(false);
    }
    onToggle();
  };

  return (
    <div
      className={`left-panel ${shouldExpand ? "" : "collapsed"} ${isProfileSettingsOpen ? "behind-overlay" : ""}`}
      onMouseEnter={() => isCollapsed && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePanelClick}
    >
      <div className="panel-header">
        <div className="logo-section">
          <div className="logo">
            <div className="logo-icon">
              <img
                src={logoIcon}
                alt="아카이브"
                className="logo-img"
              />
            </div>
          </div>
          <button className="toggle-btn" onClick={handleToggleClick}>
            <span className={`toggle-icon ${shouldExpand ? "" : "collapsed"}`}>
              {shouldExpand ? "←" : "→"}
            </span>
          </button>
        </div>
      </div>

      <div className="panel-content">
        <nav className="navigation">
          
          <div className="nav-item" onClick={onCreateNew}>
            <div className="nav-icon">
              <img src={plusIcon} alt="추가하기" className="icon-img" />
            </div>
            {shouldExpand && <span className="nav-text">새로 만들기</span>}
          </div>
          
          <div className="nav-item" onClick={onHomeClick}>
            <div className="nav-icon">
              <img src={homeIcon} alt="홈" className="icon-img" />
            </div>
            {shouldExpand && <span className="nav-text">홈</span>}
          </div>

          <div className="nav-item">
            <div className="nav-icon">
              <img src={archiveIcon} alt="아카이브" className="icon-img" />
            </div>
            {shouldExpand && <span className="nav-text">아카이브</span>}
          </div>

          {/* <div className="nav-item">
            <div className="nav-icon">
              <img src={trackerIcon} alt="역량 트래커" className="icon-img" />
            </div>
            {shouldExpand && <span className="nav-text">역량 트래커</span>}
          </div> */}

        </nav>

        {/* shouldExpand 조건 제거 - 항상 표시 */}
        <div className="bottom-section">
          {/* <div className="github-status">
            <div className="github-item">
              <div className="github-icon">
                <img src={githubIcon} alt="깃허브" className="icon-img" />
              </div>
              {shouldExpand && <span className="github-text">Github 연동 중</span>}
              {shouldExpand && <div className="status-indicator active"></div>}
            </div>
          </div> */}

          <div className="settings-section">
            <div className="nav-item2">
              <div className="nav-icon2">
                <img src={settingsIcon} alt="설정" className="icon-img" />
              </div>
              {shouldExpand && <span className="nav-text">프로필 설정</span>}
            </div>

            <LogoutButton onLogout={onLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;