import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeftPanel from "../LeftPanel/LeftPanel";
import SubActivityCard from "../ContestDetailPage/SubActivityCard";
import chipIcon1 from "../../assets/icons/puzzle.svg";
import chipIcon from "../../assets/icons/colorpuzzle.svg";
import "./ProjectDetailPage.css";
import "../ContestDetailPage/SubActivityCard.css";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activityData, setActivityData] = useState(null);
  const [subActivities, setSubActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileSettingsOpen, setIsProfileSettingsOpen] = useState(false);
  const [notes, setNotes] = useState([]);

  // ⭐ 활동 상세 + 세부활동 목록 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const access = localStorage.getItem("access");
        
        // 1. 활동 상세 조회
        const response = await fetch(`/api/activities/${id}/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch activity");

        const data = await response.json();
        console.log("✅ 받은 데이터:", data);
        setActivityData(data);

        // 2. 세부활동 목록 조회
        if (data.sub_activities && data.sub_activities.length > 0) {
          setSubActivities(data.sub_activities);
        } else {
          try {
            const subResponse = await fetch(`/api/activities/${id}/sub-activities/`, {
              headers: {
                Authorization: `Bearer ${access}`,
              },
            });
            if (subResponse.ok) {
              const subData = await subResponse.json();
              setSubActivities(Array.isArray(subData) ? subData : subData.results || []);
            }
          } catch (subError) {
            console.log("세부활동 조회 실패:", subError);
          }
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
        alert("데이터를 불러오는데 실패했습니다.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, navigate]);

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

  // ⭐ 활동 등록하기 버튼 클릭
  const handleAddActivity = () => {
    navigate(`/activity/${id}`);
  };

  // ⭐ 세부활동 카드 클릭
  const handleSubActivityClick = (subActivity) => {
    console.log("세부활동 클릭:", subActivity);
  };

  const handleAddNote = () => {
    const now = new Date();
    const dateString = `${now.getFullYear()}.${String(
      now.getMonth() + 1
    ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newNote = {
      id: Date.now(),
      date: dateString,
      text: "",
    };
    setNotes([...notes, newNote]);
  };

  const handleDeleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  const handleNoteTextChange = (noteId, newText) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, text: newText } : note
      )
    );
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
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M21.625 5C19.7609 5 18.25 6.4773 18.25 8.3C18.25 8.5827 18.2961 8.9347 18.3647 9.1965L12.3426 13.3061C11.8037 12.9497 11.0736 12.7 10.375 12.7C8.51088 12.7 7 14.1773 7 16C7 17.8227 8.51088 19.3 10.375 19.3C11.086 19.3 11.788 19.0415 12.3325 18.6752L18.367 22.8178C18.2928 23.0895 18.25 23.4052 18.25 23.7C18.25 25.5227 19.7609 27 21.625 27C23.4891 27 25 25.5227 25 23.7C25 21.8773 23.4891 20.4 21.625 20.4C20.914 20.4 20.221 20.6508 19.6776 21.0182L13.6274 16.8789C13.7005 16.6072 13.75 16.2948 13.75 16C13.75 15.7052 13.7072 15.3873 13.633 15.1156L19.6686 10.9884C20.2075 11.3437 20.9264 11.6 21.625 11.6C23.4891 11.6 25 10.1227 25 8.3C25 6.4773 23.4891 5 21.625 5ZM21.625 7.2C22.246 7.2 22.75 7.6928 22.75 8.3C22.75 8.9072 22.246 9.4 21.625 9.4C21.004 9.4 20.5 8.9072 20.5 8.3C20.5 7.6928 21.004 7.2 21.625 7.2ZM10.375 14.9C10.996 14.9 11.5 15.3928 11.5 16C11.5 16.6072 10.996 17.1 10.375 17.1C9.754 17.1 9.25 16.6072 9.25 16C9.25 15.3928 9.754 14.9 10.375 14.9ZM21.625 22.6C22.246 22.6 22.75 23.0928 22.75 23.7C22.75 24.3072 22.246 24.8 21.625 24.8C21.004 24.8 20.5 24.3072 20.5 23.7C20.5 23.0928 21.004 22.6 21.625 22.6Z"
                      fill="black"
                      fillOpacity="0.4"
                    />
                  </svg>
                </span>
              </button>
              <button className="icon-btn">
                <span>⋯</span>
              </button>
              <button className="icon-btn" onClick={() => navigate(-1)}>
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
                  ? "🧑‍🤝‍🧑 팀"
                  : "개인"}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">역할</span>
              <span className="info-value">{activityData.role || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">주제</span>
              <span className="info-value">
                {activityData.subject || "-"}
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

          {/* ⭐ 포함된 활동 - 세부활동 렌더링 */}
          <div className="activity-section">
            <div className="section-header"></div>
            
            {/* 헤더 */}
            <div className="activity-section-header">
              <span className="section-title">
                <img src={chipIcon} alt="chip" />
                포함된 활동
                <span className="activity-count">{subActivities.length}</span>
              </span>
            </div>

            {/* 세부활동이 있으면 카드 리스트, 없으면 placeholder */}
            {subActivities.length > 0 ? (
              <div className="sub-activities-list">
                {subActivities.map((subActivity) => (
                  <SubActivityCard
                    key={subActivity.id}
                    subActivity={subActivity}
                    onClick={() => handleSubActivityClick(subActivity)}
                  />
                ))}
                <button 
                  className="add-activity-btn-inline"
                  onClick={handleAddActivity}
                >
                  + 활동 추가하기
                </button>
              </div>
            ) : (
              <div className="activity-placeholder">
                <div className="placeholder-icon">
                  <img src={chipIcon1} alt="puzzle" />
                </div>
                <p className="placeholder-text">아직 정리한 활동이 없어요</p>
                <p className="placeholder-subtext">
                  이 경험의 활동을 등록해보세요
                </p>
                <button 
                  className="add-activity-btn"
                  onClick={handleAddActivity}
                >
                  + 활동 등록하기
                </button>
              </div>
            )}
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

          {/* 파일 */}
          {activityData.files && activityData.files.length > 0 && (
            <div className="files-section">
              <h2 className="section-title-main">첨부 파일</h2>
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
                <span className="link-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <path
                      d="M9 9C6.084 9 4 10.737 4 14C4 17.263 6.084 19 9 19H12C14.916 19 17 17.263 17 14C17 13.904 17 13.124 17 13C17 11.667 15 11.667 15 13C15 13.132 15 14.063 15 14.063C14.975 16.083 13.863 17 12 17H9C7.116 17 6 16.07 6 14C6 11.93 7.116 11 9 11H10C10.552 11 11 10.552 11 10C11 9.448 10.552 9 10 9H9ZM16 9C14.579 9 13.422 9.40201 12.562 10.156C11.508 11.081 11 12.451 11 14C11 14.129 11 14.296 11 15C11 15.552 11.448 16 12 16C12.552 16 13 15.552 13 15C13 14.296 13 14.129 13 14C13 12.983 13.301 12.16 13.875 11.656C14.35 11.239 15.043 11 16 11H19C21.07 11 22 12.116 22 14C22 15.884 21.07 17 19 17H18C17.448 17 17 17.448 17 18C17 18.552 17.448 19 18 19H19C22.263 19 24 16.916 24 14C24 11.084 22.263 9 19 9H16Z"
                      fill="#9F9F9F"
                    />
                  </svg>
                </span>
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
          {notes.map((note) => (
            <div key={note.id} className="note-item">
              <div className="note-header">
                <div className="note-date">📅 {note.date}</div>
                <button
                  className="note-delete-btn"
                  onClick={() => handleDeleteNote(note.id)}
                  title="삭제"
                >
                  ✕
                </button>
              </div>
              <textarea
                className="note-text-input"
                value={note.text}
                onChange={(e) => handleNoteTextChange(note.id, e.target.value)}
                placeholder="메모를 입력하세요..."
              />
            </div>
          ))}
          <button className="add-note-btn" onClick={handleAddNote}>
            + 메모 추가하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;