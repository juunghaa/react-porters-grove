// import React, { useState, useEffect } from "react";
// import LeftPanel from "./../components/LeftPanel/LeftPanel";
// import MainHome from "./../components/MainHome/MainHome";
// import ChooseOption from "./../components/ChooseOption/ChooseOption";
// import "./../App.css";
// import ProfileCard from "../components/Profile/ProfileCard";
// import githubIcon from "../assets/icons/Github.png";
// import banner from "../assets/icons/banner.png";
// import avatar from "../assets/icons/avatar.png";
// import Activity from "./../components/Activity/Activity";
// import Newsletter from "./../components/Newsletter/Newsletter";

// export default function MainPage({ onLogout }) {
//   const [profile, setProfile] = useState({
//     name: "김포터",
//     title: "Motion designer",
//     tagline: "광주에 사는 냥집사 모션 디자이너",
//     avatarUrl: avatar,
//     bannerUrl: banner,
//     socials: [],
//   });

//   const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
//   const [currentPage, setCurrentPage] = useState("home");
//   const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false); // 추가

//   const handlePanelToggle = () => {
//     setIsPanelCollapsed(!isPanelCollapsed);
//   };

//   const handleCreateNew = () => {
//     setCurrentPage("chooseOption");
//   };

//   const handleHomeClick = () => {
//     setCurrentPage("home");
//   };

//   const handleGoToActivity = () => {
//     setCurrentPage("Activity");
//   };

//   // 프로필 설정창이 열릴 때 LeftPanel 자동으로 접기
//   useEffect(() => {
//     if (isProfileSettingsOpen) {
//       setIsPanelCollapsed(true);
//     }
//   }, [isProfileSettingsOpen]);

//   const renderMainContent = () => {
//     if (currentPage === "home") {
//       return <MainHome isPanelCollapsed={isPanelCollapsed} />;
//     } else if (currentPage === "chooseOption") {
//       return <ChooseOption onGoToActivity={handleGoToActivity} />;
//     } else if (currentPage === "Activity") {
//       return <Activity />;
//     }
//     return null;
//   };

//   return (
//     <div className="App" style={{backgroundColor: "#F7F7F7"}}>
//       <LeftPanel
//         isCollapsed={isPanelCollapsed}
//         onToggle={handlePanelToggle}
//         onCreateNew={handleCreateNew}
//         onHomeClick={handleHomeClick}
//         onLogout={onLogout}
//       />
//       <div
//         className="main-content"
//         style={{
//           marginLeft: isPanelCollapsed ? "60px" : "210px", // 원래 240이였다가 220 이였다가  
//           // transition: "margin-left 0.3s ease",
//           width: `calc(100% - ${isPanelCollapsed ? "60px" : "210px"})`,
//           height: "100vh",
//           display: "flex",
//           gap: "24px",
//           padding: "24px",
//           boxSizing: "border-box",
//           // overflow: "hidden",
//           flex: "1",
//           borderRadius: "30px",
//           backgroundColor: "#F7F7F7",
//           // overflowY: "auto",
//           // overflowX: "hidden",
//           transition: "all 0.3s ease",
//         }}
//       >
//         <div style={{ flex: "1 1 auto", minWidth: 0, height: "100%", display: "flex",}}>
//           {renderMainContent()}
//         </div>

//         {currentPage === "home" && (
//           <div
//             style={{
//               width: "340px",
//               flex: "0 0 340px",
//               position: "sticky",
//               top: "24px",
//               marginLeft: "auto", // 추가! 오른쪽 끝으로 밀어냄
//               marginRight: "-40px", // 추가! 오른쪽에 딱 붙음

//             }}
//           >
//             <ProfileCard
//               {...profile}
//               socials={profile.socials}
//               onProfileUpdate={(data) =>
//                 setProfile((prev) => ({ ...prev, ...data }))
//               }
//               onSettingsOpenChange={setIsProfileSettingsOpen} // 추가
//             />
//             <Newsletter />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






// import React, { useState, useEffect } from "react";
// import LeftPanel from "./../components/LeftPanel/LeftPanel";
// import MainHome from "./../components/MainHome/MainHome";
// import ChooseOption from "./../components/ChooseOption/ChooseOption";
// import "./../App.css";
// import ProfileCard from "../components/Profile/ProfileCard";
// import banner from "../assets/icons/banner.png";
// import avatar from "../assets/icons/avatar.png";
// import Activity from "./../components/Activity/Activity";
// import Newsletter from "./../components/Newsletter/Newsletter";

// // 로고 이미지 import 추가
// import saraminLogo from "../assets/logos/saramin.png";
// import linkcareerLogo from "../assets/logos/linkcareer.png";
// import wantedLogo from "../assets/logos/wanted.png";
// import catchLogo from "../assets/logos/catch.png";

// export default function MainPage({ onLogout }) {
//   const [profile, setProfile] = useState({
//     name: "김포터",
//     title: "Motion designer",
//     tagline: "광주에 사는 냥집사 모션 디자이너",
//     avatarUrl: avatar,
//     bannerUrl: banner,
//     socials: [],
//   });

//   const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
//   const [currentPage, setCurrentPage] = useState("home");
//   const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

//   const handlePanelToggle = () => {
//     setIsPanelCollapsed(!isPanelCollapsed);
//   };

//   const handleCreateNew = () => {
//     setCurrentPage("chooseOption");
//   };

//   const handleHomeClick = () => {
//     setCurrentPage("home");
//   };

//   const handleGoToActivity = () => {
//     setCurrentPage("Activity");
//   };

//   useEffect(() => {
//     if (isProfileSettingsOpen) {
//       setIsPanelCollapsed(true);
//     }
//   }, [isProfileSettingsOpen]);

//   const renderMainContent = () => {
//     if (currentPage === "home") {
//       return <MainHome isPanelCollapsed={isPanelCollapsed} />;
//     } else if (currentPage === "chooseOption") {
//       return <ChooseOption onGoToActivity={handleGoToActivity} />;
//     } else if (currentPage === "Activity") {
//       return <Activity />;
//     }
//     return null;
//   };

//   // 기업 로고 데이터 - logo 속성 추가!
//   const companyLogos = [
//     { name: "saramin", logo: saraminLogo, url: "https://www.saramin.co.kr" },
//     { name: "LINKareer", logo: linkcareerLogo, url: "https://www.linkcareer.co.kr" },
//     { name: "wanted", logo: wantedLogo, url: "https://www.wanted.co.kr" },
//     { name: "CATCH", logo: catchLogo, url: "https://www.catch.co.kr" },
//   ];

//   return (
//     <div className="App" style={{backgroundColor: "#F7F7F7"}}>
//       <LeftPanel
//         isCollapsed={isPanelCollapsed}
//         onToggle={handlePanelToggle}
//         onCreateNew={handleCreateNew}
//         onHomeClick={handleHomeClick}
//         onLogout={onLogout}
//       />
//       <div
//         className="main-content-wrapper"
//         style={{
//           marginLeft: isPanelCollapsed ? "60px" : "210px",
//           width: `calc(100% - ${isPanelCollapsed ? "60px" : "210px"})`,
//           height: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           boxSizing: "border-box",
//           backgroundColor: "#F7F7F7",
//           transition: "all 0.3s ease",
//           overflowY: "auto",
//         }}
//       >
//         {/* 기존 메인 콘텐츠 */}
//         <div
//           style={{
//             display: "flex",
//             gap: "24px",
//             padding: "24px",
//             flex: "1 1 auto",
//             minHeight: "100vh",  
//           }}
//         >
//           <div style={{ flex: "1 1 auto", minWidth: 0, display: "flex" }}>
//             {renderMainContent()}
//           </div>

//           {currentPage === "home" && (
//             <div
//               style={{
//                 width: "340px",
//                 flex: "0 0 340px",
//                 marginLeft: "auto",
//                 // marginRight: "-40px",

//                 maxHeight: "100vh", // 뷰포트 높이에서 패딩 빼기
//                 overflowY: "auto", // 세로 스크롤 활성화
//                 // overflowX: "hidden",
//                 // display: "flex",
//                 // flexDirection: "column",
//                 // gap: "16px",
//               }}
//             >
//               <ProfileCard
//                 {...profile}
//                 socials={profile.socials}
//                 onProfileUpdate={(data) =>
//                   setProfile((prev) => ({ ...prev, ...data }))
//                 }
//                 onSettingsOpenChange={setIsProfileSettingsOpen}
//               />
//               <Newsletter />
//             </div>
//           )}
//         </div>

//         {/* 기업 로고 섹션 */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             padding: "32px 24px",
//             marginTop: "auto",
//             width: `calc(100% - ${isPanelCollapsed ? "425px" : "430px"})`,
//           }}
//         >
//           {companyLogos.map((company) => (
//             <a
//               key={company.name}
//               href={company.url}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               <img
//                 src={company.logo}
//                 alt={company.name}
//                 style={{
//                   height: "72px",
//                   objectFit: "contain",
//                 }}
//               />
//             </a>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import LeftPanel from "./../components/LeftPanel/LeftPanel";
import MainHome from "./../components/MainHome/MainHome";
import ChooseOption from "./../components/ChooseOption/ChooseOption";
import "./../App.css";
import ProfileCard from "../components/Profile/ProfileCard";
import banner from "../assets/icons/banner.png";
import avatar from "../assets/icons/avatar.png";
import Activity from "./../components/Activity/Activity";
import Newsletter from "./../components/Newsletter/Newsletter";

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

  useEffect(() => {
    if (isProfileSettingsOpen) {
      setIsPanelCollapsed(true);
    }
  }, [isProfileSettingsOpen]);

  const renderMainContent = () => {
    if (currentPage === "home") {
      return <MainHome isPanelCollapsed={isPanelCollapsed} />;
    } else if (currentPage === "chooseOption") {
      return <ChooseOption onGoToActivity={handleGoToActivity} />;
    } else if (currentPage === "Activity") {
      return <Activity />;
    }
    return null;
  };

  const companyLogos = [
    { name: "saramin", logo: saraminLogo, url: "https://www.saramin.co.kr" },
    { name: "LINKareer", logo: linkcareerLogo, url: "https://www.linkcareer.co.kr" },
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
      />
      <div
        className="main-content-wrapper"
        style={{
          marginLeft: isPanelCollapsed ? "60px" : "210px",
          width: `calc(100% - ${isPanelCollapsed ? "60px" : "210px"})`,
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
            marginLeft: "24px",
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
                socials={profile.socials}
                onProfileUpdate={(data) =>
                  setProfile((prev) => ({ ...prev, ...data }))
                }
                onSettingsOpenChange={setIsProfileSettingsOpen}
              />
              <Newsletter />
            </div>
          )}
        </div>

        {/* 기업 로고 섹션 - 홈화면일 때만 표시 */}
        {currentPage === "home" && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "32px 24px",
              marginTop: "auto",
              width: `calc(100% - ${isPanelCollapsed ? "425px" : "430px"})`,
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
        )}
      </div>
    </div>
  );
}