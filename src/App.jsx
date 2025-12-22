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
import GoogleCallback from "./pages/GoogleCallback"; // ✅ 추가
// import GoogleLoginButton from "./components/GoogleLoginButton"; // ✅ 필요 시 홈 테스트용
import ChooseOption from "./components/ChooseOption/ChooseOption"; // ✅ 추가
import MakingPortfolio from "./components/MakingPortfolio/MakingPortfolio"; // ✅ 추가
import ContestPage from "./components/Experience/ContestPage"; //공모전
import ContestDetailPage from "./components/ContestDetailPage/ContestDetailPage";
import ProjectPage from "./components/Experience/Projectpage.jsx"; //프로젝트
import ProjectDetailPage from "./components/ProjectDetailPage/ProjectDetailPage"; // ⭐ 이 줄 추가!
import InUnivPage from "./components/Experience/InUnivPage.jsx"; //교내활동
import OutUnivPage from "./components/Experience/OutUnivPage.jsx"; //교외활동
import Career from "./components/Spec/Career.jsx"; //경력
import CertificatePage from "./components/Spec/Certificate.jsx"; //자격증
import Award from "./components/Spec/Award.jsx"; //수상
import Overseas from "./components/Spec/Overseas.jsx"; //해외경험
import Language from "./components/Spec/Language.jsx"; //외국어
import PortfolioCreationFlow from "./components/MakingPortfolio/PortfolioCreationFlow";

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

  // 로그아웃 처리
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
        {/* <Route
          path="/api/v1/auth/google/callback"
          element={<GoogleCallback onLoginSuccess={handleAuthSuccess} />}
        /> */}

        <Route
          path="/auth/google/callback"
          element={<GoogleCallback onLoginSuccess={handleAuthSuccess} />}
        />

        {/* ✅ ChooseOption 페이지 */}
        <Route path="/choose" element={<ChooseOption />} />

        {/* ✅ 공모전 페이지 */}
        <Route path="/contest" element={<ContestPage />} />

        {/* 공모전 상세 페이지 */}
        <Route path="/contest/:id" element={<ContestDetailPage />} />

        {/* ✅ 프로젝트 페이지 */}
        <Route path="/project" element={<ProjectPage />} />

        {/* ✅ 프로젝트 상세 페이지 */}
        <Route path="/project/:id" element={<ProjectDetailPage />} />

        {/* ✅ 교내활동 페이지 */}
        <Route path="/campus" element={<InUnivPage />} />

        {/* ✅ 교외활동 페이지 */}
        <Route path="/external" element={<OutUnivPage />} />

        {/* ✅ 경력 페이지 */}
        <Route path="/career" element={<Career />} />

        {/* ✅ 자격증 페이지 */}
        <Route path="/certificate" element={<CertificatePage />} />

        {/* ✅ 수상 페이지 */}
        <Route path="/award" element={<Award />} />

        {/* ✅ 해외활동 페이지 */}
        <Route path="/overseas" element={<Overseas />} />

        {/* ✅ 외국어페이지 */}
        <Route path="/language" element={<Language />} />
        {/* 포트폴리오 생성 플로우 페이지 */}
        <Route path="/portfolio-creation" element={<PortfolioCreationFlow />} />

        {/* ✅ 2️⃣ 기본 로그인/회원가입/메인 흐름은 기존 그대로 유지 */}
        <Route
          path="/"
          element={
            <div className="App">
              {/* 메인 페이지 코드 올릴 때 중복 렌더링 안되게 조심 제발
                    <GithubGrass username="octocat" year="last" />
                    <h1>포트폴리오 사이트</h1> */}
              {/* {<MainPage onLogout={handleLogout} />} */}

              {isLoggedIn ? (
                <>
                  <MainPage onLogout={handleLogout} />
                </>
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

        {/* ✅ 3️⃣ ChooseOption 페이지 라우트 추가 */}
        <Route path="/choose" element={<ChooseOptionWrapper />} />

        {/* ✅ 4️⃣ MakingPortfolio 페이지 라우트 추가 */}
        <Route path="/making-portfolio" element={<MakingPortfolio />} />
      </Routes>
    </Router>
  );
}

// ✅ ChooseOption에서 navigate 사용하기 위한 래퍼 컴포넌트
function ChooseOptionWrapper() {
  const navigate = useNavigate();

  const handleGoToPortfolio = (tags) => {
    console.log("🎯 handleGoToPortfolio 호출됨!", tags);
    console.log("🚀 navigate to /making-portfolio");
    navigate("/making-portfolio", { state: { selectedTags: tags } });
  };

  const handleGoToExperience = (tags) => {
    console.log("경험 페이지로 이동:", tags);
    // navigate('/experience', { state: { selectedTags: tags } }); // 추후 구현
  };

  const handleGoToSpec = (tags) => {
    console.log("스펙 페이지로 이동:", tags);
    // navigate('/spec', { state: { selectedTags: tags } }); // 추후 구현
  };

  return (
    <ChooseOption
      onGoToExperience={handleGoToExperience}
      onGoToSpec={handleGoToSpec}
      onGoToPortfolio={handleGoToPortfolio}
    />
  );
}
