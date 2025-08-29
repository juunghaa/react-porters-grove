import React, { useState } from "react";
import "./ChooseOption.css";
import ReviewPopup from "./ReviewPopup";

const ChooseOption = ({ onGoToActivity }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="choose-option">
      <div className="option-container">
        <div className="option-card" id="retrospective" onClick={openPopup}>
          <h2 className="option-title">회고 작성하기</h2>
          <p className="option-description">
            지난 활동을 돌아보고 나만의 회고를 작성하세요.
          </p>
        </div>
        <div className="option-card" id="activity-log" onClick={onGoToActivity}>
          <h2 className="option-title">활동 기록하기</h2>
          <p className="option-description">
            스터디, 사이드 프로젝트 등 활동 내역을 기록하고 관리해보세요.
          </p>
        </div>
      </div>
      {isPopupOpen && <ReviewPopup onClose={closePopup} />}{" "}
      {/* isPopupOpen이 켜져있을때만 팝업창 나타남. 닫을때는 closePopuup사용함 */}
      {/* isPopupOpen이 켜져있을때만 팝업창 나타남*/}
    </div>
  );
};

export default ChooseOption;
