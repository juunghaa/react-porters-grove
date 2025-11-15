import React from "react";
import { createPortal } from "react-dom";
import "./ConfirmExitPopup.css";
import closePopupIcon from "../../assets/icons/closePopup.png";
import continueButtonIcon from "../../assets/icons/continueButton.png";
import saveAndExitButtonIcon from "../../assets/icons/saveAndExitButton.png";

export default function ConfirmExitPopup({ onContinue, onSaveAndExit, onClose }) {
  return createPortal(
    <div className="confirm-exit-backdrop" onClick={onClose}>
      <div className="confirm-exit-popup" onClick={(e) => e.stopPropagation()}>
        {/* 엑스 버튼 - 오른쪽 위 */}
        <img 
          src={closePopupIcon} 
          className="popup-close-button" 
          onClick={onClose}
          alt="닫기"
        />
        
        {/* 안내 문구 */}
        <div className="popup-message">
          아직 저장 전이에요<br />
          나가면 입력한 내용이 사라져요
        </div>
        
        {/* 버튼 영역 */}
        <div className="popup-buttons">
          <img 
            src={continueButtonIcon} 
            className="popup-button" 
            onClick={onContinue}
            alt="계속 작성하기"
          />
          <img 
            src={saveAndExitButtonIcon} 
            className="popup-button" 
            onClick={onSaveAndExit}
            alt="저장하고 나가기"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}