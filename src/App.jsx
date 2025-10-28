import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { exchangeGoogleCode } from "./api.js";
import LogoutButton from "./components/Auth/LogoutButton";
import "./App.css";
import GithubGrass from "./components/GithubGrass";
import OAuthCallback from "./pages/OAuthCallback";
import MainPage from "./pages/MainPage";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import ResetPWConfirm from "./components/Auth/ResetPWConfirm";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GoogleCallback from "./pages/GoogleCallback"; // ✅ 추가
// import GoogleLoginButton from "./components/GoogleLoginButton"; // ✅ 필요 시 홈 테스트용

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); //잠깐 바꿔둠
  const [view, setView] = useState("login");
  const [loggingOut, setLoggingOut] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  // 새로고침해도 유지
  useEffect(() => {
    const access = localStorage.getItem("access");
    setIsLoggedIn(!!access);
  }, []);


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

  if (token) {
    return (
      <div className="App">
        <ResetPWConfirm />
      </div>
    );
  }
  
  return (
    <Router>
      <Routes>
        {/* ✅ 1️⃣ Google OAuth redirect callback 처리 */}
        <Route
          path="/api/v1/auth/google/callback"
          element={<GoogleCallback onLoginSuccess={handleAuthSuccess} />}
        />
        
        {/* ✅ 2️⃣ 기본 로그인/회원가입/메인 흐름은 기존 그대로 유지 */}
        <Route
          path="/"
          element={
            <div className="App">
              {/* 메인 페이지 코드 올릴 때 중복 렌더링 안되게 조심 제발
                    <GithubGrass username="octocat" year="last" />
                    <h1>포트폴리오 사이트</h1> */}
              <MainPage onLogout={handleLogout}/> 

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
          }
        />
      </Routes>
    </Router>
  );
}