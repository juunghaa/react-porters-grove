import React, { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
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

  // 로그인/회원가입 공통 성공 처리
  const handleAuthSuccess = (data) => {
    if (data?.access) localStorage.setItem("access", data.access);
    if (data?.refresh) localStorage.setItem("refresh", data.refresh);
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
      빈 화면
      <GithubGrass username="octocat" year="last" />
      <h1>포트폴리오 사이트</h1>
      {/* 로그인 과정 없이 바로 메인 화면 보여주기 */}
      <MainPage onLogout={handleLogout} />
      <LogoutButton onLogout={handleLogout} />
    </div>
  );
}
