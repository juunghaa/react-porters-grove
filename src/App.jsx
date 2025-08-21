           import React, {useEffect, useState} from 'react';
           import LoginPage from './pages/LoginPage';
           import SignupPage from './pages/SignupPage';
           import LogoutButton from './components/Auth/LogoutButton';
           import './App.css';
           
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState('login'); 
  
  // 새로고침해도 유지
  useEffect(() => {
    const access = localStorage.getItem('access');
    setIsLoggedIn(!!access); }, []);

  // const handleLoginSuccess=()=>{
  //   setIsLoggedIn(true);
  //   };
  // const handleLogout=()=>{
  //   setIsLoggedIn(false);
  //   console.log("로그아웃 되었습니다.");
  //   };
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

            {/* <h2>아직 로그인 안됨</h2>
            
            <LoginPage onLoginSuccess={handleLoginSuccess}/>
            <SignupPage onLoginSuccess={handleLoginSuccess} /> */}
            
            </>
            )
            }
        </div>
    );
//             {/!* 사이드바, 메인 영역  배치 *!/}
//             <div style={{display: 'flex', minHeight: '100vh'}}>
//                 {/!* 왼쪽 사이드바 *!/}
//                 <Sidebar/>

//                 {/!* 가운데 메인 영역 *!/}
//                 <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
//                     <Header/>
//                     <div style={{padding: '20px', backgroundColor: '#f9fafb', flex: 1}}>
//                         <h1>Header와 Sidebar를 테스트 중이다</h1>
//                         <p>바쁘다 바빠</p>
//                         <p>왼쪽 사이드바를 만들었어용</p>
//                     </div>

//                     {isLoggedIn ? (
//                     <>
//                     <h2>환영합니다앙</h2>
//                     <LogoutButton onLogout={handleLogout}/>

//                     </>) : (
//                     <>

//                     <h2>아직 로그인 안됨</h2>

//                     <LoginPage onLoginSuccess={handleLoginSuccess}/>
//                     <SignupPage onLoginSuccess={handleLoginSuccess} />
//                     </>
//                     )
//                   }
//                 </div>

//                 {/!* 오른쪽 패널 *!/}
//                 <RightPanel/>
//             </div>
//         </div>
//     );
// }
// export default App;
// */
// // import React from "react";
// // import LeftPanel from "./components/LeftPanel/LeftPanel";
// // import MainHome from "./components/MainHome/MainHome";

// // function App() {
// //   return (
// //     <div className="App">
// //       <LeftPanel />
// //       <div
// //         className="main-content"
// //         style={{ marginLeft: "240px", transition: "margin-left 0.3s ease" }}
// //       >
// //         <MainHome />
// //       </div>
// //     </div>
// //   );
// // }

// // export default App;

// import React, { useState } from "react";
// import LeftPanel from "./components/LeftPanel/LeftPanel";
// import MainHome from "./components/MainHome/MainHome";

// function App() {
//   const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

//   const handlePanelToggle = () => {
//     setIsPanelCollapsed(!isPanelCollapsed);
//   };

//   return (
//     <div className="App">
//       <LeftPanel isCollapsed={isPanelCollapsed} onToggle={handlePanelToggle} />
//       <div
//         className="main-content"
//         style={{
//           marginLeft: isPanelCollapsed ? "60px" : "240px",
//           transition: "margin-left 0.3s ease",
//           width: `calc(100% - ${isPanelCollapsed ? "60px" : "240px"})`,
//         }}
//       >
//         <MainHome />
//       </div>
//     </div>
//   );
}

export default App;
