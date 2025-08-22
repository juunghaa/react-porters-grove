import React, {useEffect, useState} from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LogoutButton from './components/Auth/LogoutButton';
import './App.css';
import GithubGrass from './components/GithubGrass';
import OAuthCallback from './pages/OAuthCallback';
           
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('login'); 
  
  // 새로고침해도 유지
  useEffect(() => {
    const access = localStorage.getItem('access');
    setIsLoggedIn(!!access); }, []);

  // 로그인/회원가입 공통 성공 처리
  const handleAuthSuccess = (data) => {
    if (data?.access) localStorage.setItem('access', data.access);
    if (data?.refresh) localStorage.setItem('refresh', data.refresh);
    // 필요하면 user도 저장: localStorage.setItem('user', JSON.stringify(data.user));
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    // localStorage.removeItem('user');
    setIsLoggedIn(false);
    setView('login');
    console.log('로그아웃 되었습니다.');
  };


    return (
        <div className="App">
            빈 화면
            <GithubGrass username="octocat" year="last" />
            <h1>포트폴리오 사이트</h1>
        
        
        {isLoggedIn ? (
          <>
          <h2>환영합니다앙</h2>
          <LogoutButton onLogout={handleLogout}/>
          
          </>) : (
            <>
            <div style={{ marginBottom: 12 }}>
            <button onClick={() => setView('login')} disabled={view==='login'}>로그인</button>
            <button onClick={() => setView('signup')} disabled={view==='signup'}>회원가입</button>
            </div>

          {view === 'login' ? (
            <LoginPage onLoginSuccess={handleAuthSuccess} />
          ) : (
            <SignupPage onLoginSuccess={handleAuthSuccess} />
          )}
          {/* 나중에 각각 로그인 회원가입 버튼 여기 위에 형식 맞게 적용해서 넣으면 됩니당!!!!! */}
            
            </>
            )
            }
        </div>
    );
}

// import React, { useState } from 'react';
// import React from "react";
// import LeftPanel from "./components/LeftPanel/LeftPanel";
// import MainHome from "./components/MainHome/MainHome";
// import ChooseOption from "./components/ChooseOption/ChooseOption";
// import './App.css'; // 스타일 적용

// export default function App() {
//   const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
//   const [currentPage, setCurrentPage] = useState("home");

//   const handlePanelToggle = () => {
//     setIsPanelCollapsed(!isPanelCollapsed);
//   };

//   const handleCreateNew = () => {
//     setCurrentPage("chooseOption"); // '새로 만들기' 버튼 클릭 시 페이지 전환
//   };

//   // '홈' 버튼 클릭 시 페이지를 MainHome으로 변경하는 함수
//   const handleHomeClick = () => {
//     setCurrentPage("home");
//   };

//   const renderMainContent = () => {
//     if (currentPage === "home") {
//       return <MainHome />;
//     } else if (currentPage === "chooseOption") {
//       return <ChooseOption />;
//     }
//     return null;
//   };

//   return (
//     <div className="App">
//       <LeftPanel
//         isCollapsed={isPanelCollapsed}
//         onToggle={handlePanelToggle}
//         onCreateNew={handleCreateNew}
//         onHomeClick={handleHomeClick}
//       />
//       <div
//         className="main-content"
//         style={{
//           marginLeft: isPanelCollapsed ? "60px" : "240px",
//           transition: "margin-left 0.3s ease",
//           width: `calc(100% - ${isPanelCollapsed ? "60px" : "240px"})`,
//         }}
//       >
//         {renderMainContent()} {/* 조건부 렌더링 */}
//       </div>
//     </div>
//   );
// }
