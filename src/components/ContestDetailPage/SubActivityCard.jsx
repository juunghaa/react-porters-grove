import React from "react";
import "./SubActivityCard.css";

const SubActivityCard = ({ subActivity, onClick }) => {
  // 날짜 포맷팅
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.replace(/-/g, ".");
  };

  // 팀 구성 요약
  const getTeamSummary = () => {
    if (!subActivity.role_items || subActivity.role_items.length === 0) {
      return null;
    }
    const total = subActivity.role_items.reduce((sum, item) => sum + item.count, 0);
    return `${total}명`;
  };

  return (
    <div 
      className="sub-activity-card"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {/* 태그 */}
      <div className="sub-card-tag-row">
        <span className="sub-card-tag">세부활동</span>
        {subActivity.organization && (
          <span className="sub-card-org">{subActivity.organization}</span>
        )}
      </div>

      {/* 제목 */}
      <h4 className="sub-card-title">{subActivity.title}</h4>

      {/* 정보 행 */}
      <div className="sub-card-info">
        {getTeamSummary() && (
          <>
            <span className="sub-card-team">👥 {getTeamSummary()}</span>
            <span className="sub-card-dot">·</span>
          </>
        )}
        {subActivity.period_start && (
          <span className="sub-card-date">
            📅 {formatDate(subActivity.period_start)}
            {subActivity.period_end && ` ~ ${formatDate(subActivity.period_end)}`}
          </span>
        )}
      </div>

      {/* 설명 (situation이나 task_detail 중 하나) */}
      {(subActivity.situation || subActivity.task_detail) && (
        <p className="sub-card-description">
          {(subActivity.situation || subActivity.task_detail).substring(0, 80)}
          {(subActivity.situation || subActivity.task_detail).length > 80 && "..."}
        </p>
      )}
    </div>
  );
};

export default SubActivityCard;