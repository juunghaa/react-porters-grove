/*
import React, {useState} from 'react';
import LoginForm from './components/Auth/LoginForm';
import LogoutButton from './components/Auth/LogoutButton';
import SignupForm from './components/Auth/SignupForm';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import RightPanel from './components/RightPanel/RightPanel';


function App() {
      const [isLoggedIn, setIsLoggedIn] = useState(false);

      const handleLoginSuccess=()=>{
        setIsLoggedIn(true);
      };/!**!/
      const handleLogout=()=>{
        setIsLoggedIn(false);
        console.log("로그아웃 되었습니다.");
      };

    return (
        <div className="App">
            {/!* 사이드바, 메인 영역  배치 *!/}
            <div style={{display: 'flex', minHeight: '100vh'}}>
                {/!* 왼쪽 사이드바 *!/}
                <Sidebar/>

                {/!* 가운데 메인 영역 *!/}
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <Header/>
                    <div style={{padding: '20px', backgroundColor: '#f9fafb', flex: 1}}>
                        <h1>Header와 Sidebar를 테스트 중이다</h1>
                        <p>바쁘다 바빠</p>
                        <p>왼쪽 사이드바를 만들었어용</p>
                    </div>

                    {isLoggedIn ? (
                    <>
                    <h2>환영합니다앙</h2>
                    <LogoutButton onLogout={handleLogout}/>

                    </>) : (
                    <>

                    <h2>아직 로그인 안됨</h2>

                    <LoginPage onLoginSuccess={handleLoginSuccess}/>
                    <SignupPage onLoginSuccess={handleLoginSuccess} />
                    </>
                    )
                  }
                </div>

                {/!* 오른쪽 패널 *!/}
                <RightPanel/>
            </div>
        </div>
    );
}
export default App;
*/
// import React from "react";
// import LeftPanel from "./components/LeftPanel/LeftPanel";
// import MainHome from "./components/MainHome/MainHome";

// function App() {
//   return (
//     <div className="App">
//       <LeftPanel />
//       <div
//         className="main-content"
//         style={{ marginLeft: "240px", transition: "margin-left 0.3s ease" }}
//       >
//         <MainHome />
//       </div>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import MainHome from "./components/MainHome/MainHome";
import ChooseOption from "./components/ChooseOption/ChooseOption";

function App() {
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

export default App;
