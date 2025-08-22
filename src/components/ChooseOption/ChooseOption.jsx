import React from "react";
import "./ChooseOption.css";

const ChooseOption = () => {
  return (
    <div className="choose-option">
      <div className="option-container">
        <div className="option-card" id="retrospective">
          <h2 className="option-title">회고 작성하기</h2>
          <p className="option-description">
            지난 활동을 돌아보고 나만의 회고를 작성하세요.
          </p>
        </div>
        <div className="option-card" id="activity-log">
          <h2 className="option-title">활동 기록하기</h2>
          <p className="option-description">
            스터디, 사이드 프로젝트 등 활동 내역을 기록하고 관리해보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChooseOption;
