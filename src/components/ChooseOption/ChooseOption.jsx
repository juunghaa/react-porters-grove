import React, { useState } from "react";
import "./ChooseOption.css";
import ReviewPopup from "./ReviewPopup";

// const ChooseOption = ({ onGoToActivity }) => {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   const openPopup = () => {
//     setIsPopupOpen(true);
//   };

//   const closePopup = () => {
//     setIsPopupOpen(false);
//   };

//   return (
//     <div className="choose-option">
//       <div className="option-container">
//         <div className="option-card" id="retrospective" onClick={openPopup}>
//           <h2 className="option-title">회고 작성하기</h2>
//           <p className="option-description">
//             지난 활동을 돌아보고 나만의 회고를 작성하세요.
//           </p>
//         </div>
//         <div className="option-card" id="activity-log" onClick={onGoToActivity}>
//           <h2 className="option-title">활동 기록하기</h2>
//           <p className="option-description">
//             스터디, 사이드 프로젝트 등 활동 내역을 기록하고 관리해보세요.
//           </p>
//         </div>
//       </div>
//       {isPopupOpen && <ReviewPopup onClose={closePopup} />}{" "}
//       {/* isPopupOpen이 켜져있을때만 팝업창 나타남. 닫을때는 closePopuup사용함 */}
//       {/* isPopupOpen이 켜져있을때만 팝업창 나타남*/}
//     </div>
//   );
// };
const ChooseOption = ({ onGoToExperience, onGoToSpec, onGoToPortfolio }) => {
  return (
    <div className="choose-option">
      <div className="choose-header">
        <div className="choose-logo">
          <img src="./images/logomark.png" alt="로고" />
        </div>
        <h1 className="choose-title">무엇을 정리할까요?</h1>
        <p className="choose-subtitle">지금까지의 활동을 정리해 기록으로 남겨요</p>
      </div>

      <div className="option-container">
        {/* 경험 카드 */}
        <div className="option-card" onClick={onGoToExperience}>
          <img 
            src="./images/Card_Experience.png" 
            alt="경험 - 프로젝트, 동아리, 공모전 등 나의 경험을 기록해요" 
          />
        </div>

        {/* 스펙 카드 */}
        <div className="option-card" onClick={onGoToSpec}>
          <img 
            src="./images/Card_Spec.png" 
            alt="스펙 - 자격증, 수상, 어학 등 나의 역량을 정리해요" 
          />
        </div>

        {/* 포트폴리오 카드 */}
        <div className="option-card" onClick={onGoToPortfolio}>
          <img 
            src="./images/Card_Portfolio.png" 
            alt="포트폴리오 - 내가 쌓은 경험과 스펙, 스킬을 모아 정리해요" 
          />
        </div>
      </div>
    </div>
  );
};

export default ChooseOption;
