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
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import GoogleCallback from "./pages/GoogleCallback";
import ChooseOption from "./components/ChooseOption/ChooseOption";
import MakingPortfolio from "./components/MakingPortfolio/MakingPortfolio";
import ContestPage from "./components/Experience/ContestPage";
import ContestDetailPage from "./components/ContestDetailPage/ContestDetailPage";
import ProjectPage from "./components/Experience/Projectpage.jsx";
import ProjectDetailPage from "./components/ProjectDetailPage/ProjectDetailPage";
import InUnivPage from "./components/Experience/InUnivPage.jsx";
import OutUnivPage from "./components/Experience/OutUnivPage.jsx";
import Career from "./components/Spec/Career.jsx";
import CertificatePage from "./components/Spec/Certificate.jsx";
import Award from "./components/Spec/Award.jsx";
import Overseas from "./components/Spec/Overseas.jsx";
import Language from "./components/Spec/Language.jsx";
import PortfolioCreationFlow from "./components/MakingPortfolio/PortfolioCreationFlow";
import Activity from "./components/Activity/Activity.jsx";  // 경로 확인 필요

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [view, setView] = useState("login");
  const [loggingOut, setLoggingOut] = useState(false);

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  useEffect(() => {
    const access = localStorage.getItem("access");
    setIsLoggedIn(!!access);
  }, []);

  const handleAuthSuccess = (data) => {
    const access = data?.tokens?.access ?? data?.access;
    const refresh = data?.tokens?.refresh ?? data?.refresh;

    if (access) localStorage.setItem("access", access);
    if (refresh) localStorage.setItem("refresh", refresh);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
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
        {/* Google OAuth callback */}
        <Route
          path="/auth/google/callback"
          element={<GoogleCallback onLoginSuccess={handleAuthSuccess} />}
        />

        {/* ⭐ 경험 관련 라우트 */}
        <Route path="/choose" element={<ChooseOptionWrapper />} />
        <Route path="/contest" element={<ContestPage />} />
        <Route path="/contest/:id" element={<ContestDetailPage />} />
        <Route path="/project" element={<ProjectPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/campus" element={<InUnivPage />} />
        <Route path="/external" element={<OutUnivPage />} />

        {/* ⭐ 활동(세부활동) 에디터 */}
        <Route path="/activity/:activityId" element={<Activity />} />
        <Route path="/activity" element={<Activity />} />  {/* 새 활동 생성용 */}

        {/* ⭐ 스펙 관련 라우트 */}
        <Route path="/career" element={<Career />} />
        <Route path="/certificate" element={<CertificatePage />} />
        <Route path="/award" element={<Award />} />
        <Route path="/overseas" element={<Overseas />} />
        <Route path="/language" element={<Language />} />

        {/* ⭐ 포트폴리오 관련 라우트 */}
        <Route path="/portfolio-creation" element={<PortfolioCreationFlow />} />
        <Route path="/making-portfolio" element={<MakingPortfolio />} />

        {/* ⭐ 메인 페이지 */}
        <Route
          path="/"
          element={
            <div className="App">
              {isLoggedIn ? (
                <MainPage onLogout={handleLogout} />
              ) : (
                <>
                  {view === "login" && (
                    <LoginPage
                      onLoginSuccess={handleAuthSuccess}
                      onChangeView={setView}
                    />
                  )}
                  {view === "signup" && (
                    <SignupPage
                      onLoginSuccess={handleAuthSuccess}
                      onChangeView={setView}
                    />
                  )}
                </>
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

// ChooseOption 래퍼
function ChooseOptionWrapper() {
  const navigate = useNavigate();

  const handleGoToPortfolio = (tags) => {
    console.log("🎯 handleGoToPortfolio 호출됨!", tags);
    console.log("🚀 navigate to /making-portfolio");
    navigate("/making-portfolio", { state: { selectedTags: tags } });
  };

  const handleGoToExperience = (tags) => {
    console.log("경험 페이지로 이동:", tags);
  };

  const handleGoToSpec = (tags) => {
    console.log("스펙 페이지로 이동:", tags);
  };

  return (
    <ChooseOption
      onGoToExperience={handleGoToExperience}
      onGoToSpec={handleGoToSpec}
      onGoToPortfolio={handleGoToPortfolio}
    />
  );
}
