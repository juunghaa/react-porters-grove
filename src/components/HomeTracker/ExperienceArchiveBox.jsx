import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SubActivityCard from "./SubActivityCard";
import "./ExperienceArchiveBox.css";

// ⭐ 세부활동 목록 API
const fetchSubActivities = async (activityId) => {
  const access = localStorage.getItem("access");

  const response = await fetch(
    `/api/activities/${activityId}/sub-activities/`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("세부활동 목록 조회 실패");
  }

  return response.json();
};

const ExperienceArchiveBox = ({ activity, isPanelCollapsed, onGoToEditor }) => {
  const navigate = useNavigate();
  const [subActivities, setSubActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);

  // 세부활동 로드
  useEffect(() => {
    const loadSubActivities = async () => {
      if (!activity?.id) return;

      try {
        // API에서 sub_activities가 이미 포함되어 있으면 그것 사용
        if (activity.sub_activities && activity.sub_activities.length > 0) {
          setSubActivities(activity.sub_activities);
        } else {
          const data = await fetchSubActivities(activity.id);
          setSubActivities(data || []);
        }
      } catch (error) {
        console.error("세부활동 로딩 실패:", error);
        setSubActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubActivities();
  }, [activity]);

  // 태그 표시 (category나 primary_tag에서)
  const getTagLabel = () => {
    if (activity.category?.name) return activity.category.name;
    if (activity.primary_tags && activity.primary_tags.length > 0) {
      return activity.primary_tags[0].name;
    }
    // activity_type으로 태그 표시
    const typeMap = {
      CONTEST: "공모전",
      PROJECT: "프로젝트",
      CLUB: "동아리",
      CAMPUS: "교내활동",
      EXTRACURRICULAR: "대외활동",
      HACKATHON: "해커톤",
      RESEARCH: "연구",
      EDUCATION: "교육",
      STARTUP: "창업",
      VOLUNTEER: "봉사",
      OTHER: "기타",
    };
    return typeMap[activity.activity_type] || "경험";
  };

  // ⭐ 더보기 버튼 클릭 - 경험 상세 페이지로 이동
  const handleMoreClick = (e) => {
    e.stopPropagation();
    if (onGoToEditor) {
      onGoToEditor();
    }
  };

  // ⭐ 세부활동 카드 클릭 - 활동 에디터로 이동 (기존 데이터 포함)
  const handleSubActivityClick = (subActivity, e) => {
    e.stopPropagation();
    if (subActivity?.id && activity?.id) {
      // 세부활동 에디터로 이동 (activityId와 subActivityId 전달)
      navigate(`/activity/${activity.id}/${subActivity.id}`);
    }
  };

  // ⭐ 새 활동 추가 버튼 클릭
  const handleAddSubActivity = (e) => {
    e.stopPropagation();
    if (activity?.id) {
      navigate(`/activity/${activity.id}`);
    }
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // ⭐ 경험 카드 전체 클릭
  const handleCardClick = () => {
    if (onGoToEditor) {
      onGoToEditor();
    }
  };

  if (!activity) return null;

  return (
    <div
      className={`experience-archive-box ${isPanelCollapsed ? "expanded" : ""}`}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* 헤더 */}
      <div className="archive-box-header" onClick={toggleExpand}>
        <div className="archive-box-left">
          {/* 태그 */}
          <span className="archive-box-tag">{getTagLabel()}</span>
          {/* 제목 */}
          <h3 className="archive-box-title">{activity.title}</h3>
        </div>

        <div className="archive-box-right">
          {/* 세부활동 개수 */}
          <span className="archive-box-count">{subActivities.length}</span>

          {/* ⭐ 더보기 버튼 - 대각선 화살표로 변경 */}
          <button className="archive-box-more-btn" onClick={handleMoreClick}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M5.83333 14.1667L14.1667 5.83333M14.1667 5.83333H5.83333M14.1667 5.83333V14.1667"
                stroke="#808080"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 펼침/접힘 아이콘 */}
          <button className="archive-box-toggle-btn" onClick={toggleExpand}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              style={{
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            >
              <path
                d="M5 7.5L10 12.5L15 7.5"
                stroke="#666"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* 세부활동 카드 리스트 */}
      {isExpanded && (
        <div className="archive-box-content">
          {loading ? (
            <div className="archive-loading">로딩 중...</div>
          ) : subActivities.length === 0 ? (
            <div className="archive-empty">
              <p>아직 세부 활동이 없어요</p>
              <button
                className="add-sub-activity-btn"
                onClick={handleAddSubActivity}
              >
                + 세부 활동 추가하기
              </button>
            </div>
          ) : (
            <div className="sub-activity-list">
              {subActivities.map((subActivity) => (
                <div
                  key={subActivity.id}
                  onClick={(e) => handleSubActivityClick(subActivity, e)}
                  className="sub-activity-clickable"
                >
                  <SubActivityCard
                    subActivity={subActivity}
                    activityTitle={activity.title}
                  />
                </div>
              ))}
              {/* ⭐ 활동 추가 버튼 */}
              <button
                className="add-sub-activity-btn-inline"
                onClick={handleAddSubActivity}
              >
                + 활동 추가하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceArchiveBox;