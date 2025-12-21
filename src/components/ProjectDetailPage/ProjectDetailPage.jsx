import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeftPanel from "../LeftPanel/LeftPanel";
import chipIcon1 from "../../assets/icons/puzzle.svg";
import chipIcon from "../../assets/icons/colorpuzzle.svg";
import "./ProjectDetailPage.css";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activityData, setActivityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);

  useEffect(() => {
    fetchActivityDetail();
  }, [id]);

  const fetchActivityDetail = async () => {
    try {
      const access = localStorage.getItem("access");
      const response = await fetch(`/api/activities/${id}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch activity");

      const data = await response.json();
      setActivityData(data);
    } catch (error) {
      console.error("Error fetching activity:", error);
      alert("데이터를 불러오는데 실패했습니다.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleHomeClick = () => navigate("/");
  const handleCreateNew = () => navigate("/choose");
  const handleArchiveClick = () => navigate("/archive");
  const handleOpenProfileSettings = () => setIsProfileSettingsOpen(true);
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!activityData) {
    return <div className="error">데이터를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="project-detail-container">
      <LeftPanel
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        onHomeClick={handleHomeClick}
        onCreateNew={handleCreateNew}
        onArchiveClick={handleArchiveClick}
        onLogout={handleLogout}
        isProfileSettingsOpen={isProfileSettingsOpen}
        onOpenProfileSettings={handleOpenProfileSettings}
      />

      <div className={`detail-content ${isCollapsed ? "expanded" : ""}`}>
        <div className="detail-main-box">
          {/* 헤더 */}
          <div className="detail-header">
            <div className="breadcrumb">
              <span className="breadcrumb-item">프로젝트</span>
            </div>
            <div className="header-actions">
              <button className="icon-btn">
                <span>📤</span>
              </button>
              <button className="icon-btn">
                <span>⋯</span>
              </button>
              <button className="icon-btn">
                <span>✕</span>
              </button>
            </div>
          </div>

          {/* 타이틀 */}
          <h1 className="detail-title">{activityData.title}</h1>
          <p className="detail-subtitle">{activityData.subject}</p>

          {/* 기본 정보 */}
          <div className="info-grid">
            <div className="info-row">
              <span className="info-label">참여 형태</span>
              <span className="info-value">
                {activityData.participation_type === "team"
                  ? "🧑‍🤝‍🧑 Team MindFlow"
                  : "개인"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">역할</span>
              <span className="info-value">{activityData.role || "팀장"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">주제</span>
              <span className="info-value">
                {activityData.subject || "프론트엔드"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">진행 기간</span>
              <span className="info-value">
                {activityData.period_start && activityData.period_end
                  ? `${activityData.period_start} ~ ${
                      activityData.period_end || "진행 중"
                    }`
                  : "기간 미정"}
              </span>
            </div>
          </div>

          {/* 포함된 활동 */}
          <div className="activity-section">
            <div className="section-header"></div>
            <div className="activity-placeholder">
              <span className="section-title">
                <img src={chipIcon}></img>포함된 활동
              </span>
              <span className="activity-count">0</span>
              <div className="placeholder-icon">
                <img src={chipIcon1}></img>
              </div>
              <p className="placeholder-text">아직 정리한 활동이 없어요</p>
              <p className="placeholder-subtext">
                이 경험의 활동을 등록해보세요
              </p>
              <button className="add-activity-btn">+ 활동 등록하기</button>
            </div>
          </div>

          {/* 세부 내용 */}
          <div className="detail-section">
            <h2 className="section-title-main">세부 내용</h2>

            {activityData.situation && (
              <div className="detail-block">
                <h3 className="detail-block-title">Situation (상황)</h3>
                <p className="detail-block-content">{activityData.situation}</p>
              </div>
            )}

            {activityData.task_detail && (
              <div className="detail-block">
                <h3 className="detail-block-title">Task (과제)</h3>
                <p className="detail-block-content">
                  {activityData.task_detail}
                </p>
              </div>
            )}

            {activityData.action_detail && (
              <div className="detail-block">
                <h3 className="detail-block-title">Action (행동)</h3>
                <p className="detail-block-content">
                  {activityData.action_detail}
                </p>
              </div>
            )}

            {activityData.result_detail && (
              <div className="detail-block">
                <h3 className="detail-block-title">Result (결과)</h3>
                <p className="detail-block-content">
                  {activityData.result_detail}
                </p>
              </div>
            )}

            {activityData.takeaway && (
              <div className="detail-block">
                <h3 className="detail-block-title">Taken (교훈)</h3>
                <p className="detail-block-content">{activityData.takeaway}</p>
              </div>
            )}
          </div>

          {/* 정부 파일 */}
          {activityData.files && activityData.files.length > 0 && (
            <div className="files-section">
              <h2 className="section-title-main">정부 파일</h2>
              <div className="files-list">
                {activityData.files.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-icon">
                      {file.name.endsWith(".pdf") ? "PDF" : "FIG"}
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-size">{file.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 링크 */}
          {activityData.link_url && (
            <div className="links-section">
              <h2 className="section-title-main">링크</h2>
              <div className="link-item">
                <span className="link-icon">🔗</span>
                <a
                  href={activityData.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-url"
                >
                  {activityData.link_url}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 우측 사이드바 - 경험 노트 */}
      <div className="right-sidebar">
        <div className="sidebar-header">
          <h3>경험 노트</h3>
        </div>
        <div className="notes-list">
          {/* 예시 노트들 */}
          <div className="note-item">
            <div className="note-date">📅 2025.05.22 11:05</div>
            <p className="note-text">
              오늘은 아이디어 세션 진행! 도심속 라스트마일 이동 문제를 주제로
              3자리 토론했음 도출...
            </p>
          </div>
          <div className="note-item">
            <div className="note-date">📅 2025.05.29 16:32</div>
            <p className="note-text">
              사용자 리서치 설문 1차 결과 정리 완료. 이동 측 불편함과는 충분한
              문제를...
            </p>
          </div>
          <div className="note-item">
            <div className="note-date">📅 2025.06.04 12:20</div>
            <p className="note-text"></p>
          </div>
          <button className="add-note-btn">+ 메모 추가하기</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
