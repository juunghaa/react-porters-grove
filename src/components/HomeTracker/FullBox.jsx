import React from "react";
import "./FullBox.css";
  
const FullBox = ({
  isPanelCollapsed,
  config,
  experienceData,
  onMenuClick,
  onClick, // ⭐ 추가
}) => {
  return (
    <div className={`box-status ${isPanelCollapsed ? "expanded" : ""}`}>
      <div className="box-content">
        {/* 헤더 - 클릭 안 됨 */}
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
                e.stopPropagation(); // ⭐ 카드 클릭 방지
                onMenuClick();
              }}
            >
              <span>⋯</span>
            </button>
          </div>
        </div>

        {/* ⭐ 카드 본문 - 클릭 가능 */}
        <div
          className="full-box-card"
          onClick={onClick} // ⭐ 클릭 시 상세 페이지로 이동
          style={{ cursor: onClick ? "pointer" : "default" }} // ⭐ 커서 변경
        >
          {/* 배지 */}
          <div className="full-box-badge">
            {experienceData.category || "프로젝트"}
          </div>

          {/* 제목 */}
          <h4 className="full-box-card-title">{experienceData.title}</h4>

          {/* 날짜 */}
          <p className="full-box-card-date">
            {experienceData.period_start && experienceData.period_end
              ? `${experienceData.period_start} ~ ${experienceData.period_end || "진행 중"}`
              : "기간 미정"}
          </p>

          {/* 설명 */}
          <p className="full-box-card-description">
            {experienceData.subject ||
              experienceData.situation?.substring(0, 100) + "..."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FullBox;
