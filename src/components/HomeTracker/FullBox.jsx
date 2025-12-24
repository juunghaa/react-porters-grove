import React from "react";
import "./FullBox.css";

const FullBox = ({
  isPanelCollapsed,
  config,
  experienceData, // 배열 또는 단일 객체
  onMenuClick,
  onClick,
}) => {
  if (!config) return null;

  // experienceData가 배열이면 첫 번째 항목 사용, 아니면 그대로 사용
  const data = Array.isArray(experienceData) ? experienceData[0] : experienceData;

  // 데이터가 없으면 null 반환
  if (!data) return null;

  // 카테고리/태그 결정
  const getTag = () => {
    if (data.category) return data.category;
    if (data.activity_type) {
      const typeMap = {
        contest: "공모전",
        project: "프로젝트",
        club: "동아리",
        intern: "인턴",
        volunteer: "봉사활동",
        study: "스터디",
      };
      return typeMap[data.activity_type] || "활동";
    }
    return "프로젝트";
  };

  // 참여 형태
  const getTeamType = () => {
    if (data.participation_type === "team") return "팀";
    if (data.participation_type === "individual") return "개인";
    return data.participation_type || "";
  };

  return (
    <div className={`box-status ${isPanelCollapsed ? "expanded" : ""}`}>
      <div className="box-content">
        {/* 헤더 */}
        <div className="full-box-header">
          <div className="full-box-title">
            <img
              src={config.titleIcon}
              alt="icon"
              className="full-box-title-icon"
            />
            <h3>{config.title}</h3>
            <span className="full-box-count">{config.count}</span>
          </div>
          <div className="full-box-actions">
            <button
              className="full-box-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                onMenuClick?.();
              }}
            >
              <span>⋯</span>
            </button>
          </div>
        </div>

        {/* 경험 카드 콘텐츠 */}
        <div
          className="experience-card"
          onClick={onClick}
          style={{ cursor: onClick ? "pointer" : "default" }}
        >
          {/* 태그와 역할 */}
          <div className="card-tag-role">
            <div className="card-tag">{getTag()}</div>
            {data.role && <span className="card-role">{data.role}</span>}
          </div>

          {/* 타이틀 섹션 */}
          <div className="card-title-section">
            <h4 className="card-title">{data.title}</h4>
            <div className="card-subtitle">
              {getTeamType() && (
                <>
                  <span>{getTeamType()}</span>
                  <span className="dot">·</span>
                </>
              )}
              {data.subject && (
                <>
                  <span>{data.subject}</span>
                  {data.role && <span className="dot">·</span>}
                </>
              )}
              {data.role && <span>{data.role}</span>}
            </div>
          </div>

          {/* 구분선 */}
          <div className="card-divider"></div>

          {/* 날짜 */}
          <div className="card-date">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="18"
              viewBox="0 0 17 18"
              fill="none"
            >
              <path
                d="M5.69644 1.92773C5.30544 1.92773 4.98811 2.24507 4.98811 2.63607C3.42198 2.63607 2.13281 3.90611 2.13281 5.4694V6.88607L2.15477 12.5527C2.15477 14.1153 3.4234 15.3861 4.98811 15.3861H12.0714C13.6362 15.3861 14.9048 14.1174 14.9048 12.5527L14.8828 6.88607V5.4694C14.8828 3.90328 13.6347 2.63607 12.0714 2.63607C12.0714 2.24507 11.7548 1.92773 11.3631 1.92773C10.9721 1.92773 10.6548 2.24507 10.6548 2.63607H6.40478C6.40478 2.24507 6.08815 1.92773 5.69644 1.92773ZM4.98811 4.05273C4.98811 4.44373 5.30544 4.76107 5.69644 4.76107C6.08815 4.76107 6.40478 4.44373 6.40478 4.05273H10.6548C10.6548 4.44373 10.9721 4.76107 11.3631 4.76107C11.7548 4.76107 12.0714 4.44373 12.0714 4.05273C12.8485 4.05273 13.4661 4.68173 13.4661 5.4694V6.17773C12.1033 6.17773 4.91231 6.17773 3.54948 6.17773V5.4694C3.54948 4.69236 4.20044 4.05273 4.98811 4.05273ZM3.54948 7.5944C4.91231 7.5944 12.1033 7.5944 13.4661 7.5944L13.4881 12.5527C13.4881 13.3326 12.8542 13.9694 12.0714 13.9694H4.98811C4.20611 13.9694 3.57144 13.3354 3.57144 12.5527L3.54948 7.5944Z"
                fill="#303030"
                fillOpacity="0.4"
              />
            </svg>
            <span>
              {data.period_start
                ? `${data.period_start} ~ ${data.period_end || "진행 중"}`
                : "기간 미정"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullBox;