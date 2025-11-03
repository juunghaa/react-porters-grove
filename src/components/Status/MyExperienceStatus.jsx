import React from "react";
import "./MyExperienceStatus.css";

const MyExperienceStatus = () => {
  return (
    <div className="experience-status">
      <div className="experience-header">
        <h2 className="experience-title">나의 경험 현황</h2>
        <p className="experience-subtext">
          아직 등록된 경험이 없어요. 지금 바로 남겨볼까요?{" "}
          <span className="highlight">+ 경험 정리하기</span>
        </p>
      </div>

      <div className="experience-grid">
        {[
          { icon: "📁", label: "프로젝트", count: 0 },
          { icon: "💼", label: "포트폴리오", count: 0 },
          { icon: "🎓", label: "경력", count: 0 },
          { icon: "🏆", label: "수상", count: 0 },
          { icon: "🪪", label: "자격증", count: 0 },
          { icon: "🗣️", label: "외국어", count: 0 },
          { icon: "🌏", label: "해외경험", count: 0 },
        ].map((item) => (
          <div className="exp-item" key={item.label}>
            <div className="exp-icon">{item.icon}</div>
            <div className="exp-label">{item.label}</div>
            <div className="exp-count">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyExperienceStatus;
