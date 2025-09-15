// import React, { useEffect, useState } from "react";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import {exchangeGoogleCode} from "./api.js";
// import LogoutButton from "./components/Auth/LogoutButton";
// import "./App.css";
// import GithubGrass from "./components/GithubGrass";
// import OAuthCallback from "./pages/OAuthCallback";
// import MainPage from "./pages/MainPage";
// import LeftPanel from "./components/LeftPanel/LeftPanel";

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); //잠깐 바꿔둠
//   const [view, setView] = useState("login");
//   const [loggingOut, setLoggingOut] = useState(false);

//   // 새로고침해도 유지
//   useEffect(() => {
//     const access = localStorage.getItem("access");
//     setIsLoggedIn(!!access);
//   }, []);

//   // 로그인/회원가입 공통 성공 처리
//   const handleAuthSuccess = (data) => {
//     const access = data?.tokens?.access ?? data?.access;
//     const refresh = data?.tokens?.refresh ?? data?.refresh;
    
//     if (access) localStorage.setItem("access", access);
//     if (refresh) localStorage.setItem("refresh", refresh);
//     // if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
//     // 필요하면 user도 저장: localStorage.setItem('user', JSON.stringify(data.user));
//     setIsLoggedIn(true);
//   };

//   const handleLogout = async () => {
//     if (loggingOut) return; // 중복 클릭 방지
//     setLoggingOut(true);
//     // await logoutFlow();
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");
//     // localStorage.removeItem('user');
//     setLoggingOut(false);
//     setIsLoggedIn(false);
//     setView("login");
//     console.log("로그아웃 되었습니다.");
//   };

//   return (
//     <div className="App">
//       {/* 메인 페이지 코드 올릴 때 중복 렌더링 안되게 조심 제발
//             <GithubGrass username="octocat" year="last" />
//             <h1>포트폴리오 사이트</h1> */}
//       {/* <MainPage onLogout={handleLogout}/>  */}

//       {isLoggedIn ? (
//         <>
//           <MainPage onLogout={handleLogout} />
//         </>
//       ) : (
//         <>

//           {view === "login" && <LoginPage onLoginSuccess={handleAuthSuccess} onChangeView={setView} />}
//           {view === "signup" && <SignupPage onLoginSuccess={handleAuthSuccess} onChangeView={setView} />}
//           {/* {view === "reset" && <ResetPasswordPage onChangeView={setView} />} */}
          
//           {/* 
//           {view === "login" ? (
//             <LoginPage onLoginSuccess={handleAuthSuccess} onChangeView={setView} />
//           ) : (
//             <SignupPage onLoginSuccess={handleAuthSuccess} />
//           )} */}
//           {/* 나중에 각각 로그인 회원가입 버튼 여기 위에 형식 맞게 적용해서 넣으면 됩니당!!!!! */}
//         </>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import {exchangeGoogleCode} from "./api.js";
import LogoutButton from "./components/Auth/LogoutButton";
import "./App.css";
import GithubGrass from "./components/GithubGrass";
import OAuthCallback from "./pages/OAuthCallback";
import MainPage from "./pages/MainPage";
import LeftPanel from "./components/LeftPanel/LeftPanel";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); //잠깐 바꿔둠
  const [view, setView] = useState("login");
  const [loggingOut, setLoggingOut] = useState(false);

  // 새로고침해도 유지
  useEffect(() => {
    const access = localStorage.getItem("access");
    setIsLoggedIn(!!access);
  }, []);

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const isGoogle = 
  //     (window.location.pathname === "/oauth-callback" || window.location.pathname === "/auth/callback") &&
  //     params.get("provider") === "google";
  //   const code = params.get("code");
  //   const returnedState = params.get("state");

  //   if (!isGoogle || !code) return; // 일반 진입이면 아무 것도 안 함

  //   (async () => {
  //     try {
  //       // 1) state 검증 (CSRF 방지)
  //       const savedState = sessionStorage.getItem("oauth_state_google");
  //       if (!returnedState || !savedState || returnedState !== savedState) {
  //         throw new Error("보안 검증 실패: state 불일치");
  //       }

  //       // 2) 서버에 code 교환 요청 (로그인 시작 때 쓴 redirectUri와 동일해야 함)
  //       // const redirectUri = `${window.location.origin}/oauth-callback?provider=google`;
  //       const redirectUri = `${window.location.origin}/auth/callback?provider=google`;
  //       const data = await exchangeGoogleCode(code, redirectUri);

  //       // 3) 토큰 꺼내서 저장 (백엔드 응답 형태 두 가지 모두 대응)
  //       const access =
  //         data?.tokens?.access ?? data?.access ?? null;
  //       const refresh =
  //         data?.tokens?.refresh ?? data?.refresh ?? null;

  //       if (access) localStorage.setItem("access", access);
  //       if (refresh) localStorage.setItem("refresh", refresh);
  //       if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

  //       // 4) 로그인 상태 반영
  //       setIsLoggedIn(true);

  //       // 5) URL 정리 (code/state 제거)
  //       window.history.replaceState({}, "", `${window.location.origin}/`);
  //     } catch (err) {
  //       console.error(err);
  //       alert(err.message || "구글 로그인 실패");
  //     } finally {
  //       // 사용 끝난 state는 제거
  //       sessionStorage.removeItem("oauth_state_google");
  //     }
  //   })();
  // }, []);


  // 로그인/회원가입 공통 성공 처리
  const handleAuthSuccess = (data) => {
    const access = data?.tokens?.access ?? data?.access;
    const refresh = data?.tokens?.refresh ?? data?.refresh;
    
    if (access) localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    // if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
    // 필요하면 user도 저장: localStorage.setItem('user', JSON.stringify(data.user));
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    if (loggingOut) return; // 중복 클릭 방지
    setLoggingOut(true);
    // await logoutFlow();
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    // localStorage.removeItem('user');
    setLoggingOut(false);
    setIsLoggedIn(false);
    setView("login");
    console.log("로그아웃 되었습니다.");
  };

  return (
    <div className="App">
      {/* 메인 페이지 코드 올릴 때 중복 렌더링 안되게 조심 제발
            <GithubGrass username="octocat" year="last" />
            <h1>포트폴리오 사이트</h1> */}
      {/* <MainPage onLogout={handleLogout}/>  */}

      {isLoggedIn ? (
        <>
          <MainPage onLogout={handleLogout} />
        </>
      ) : (
        <>
        
          {view === "login" && <LoginPage onLoginSuccess={handleAuthSuccess} onChangeView={setView} />}
          {view === "signup" && <SignupPage onLoginSuccess={handleAuthSuccess} onChangeView={setView} />}
          {/* {view === "reset" && <ResetPasswordPage onChangeView={setView} />} */}
          
          {/* 
          {view === "login" ? (
            <LoginPage onLoginSuccess={handleAuthSuccess} onChangeView={setView} />
          ) : (
            <SignupPage onLoginSuccess={handleAuthSuccess} />
          )} */}
          {/* 나중에 각각 로그인 회원가입 버튼 여기 위에 형식 맞게 적용해서 넣으면 됩니당!!!!! */}
        </>
      )}
    </div>
  );
}
