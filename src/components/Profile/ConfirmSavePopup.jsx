import React from "react";
import { createPortal } from "react-dom";
import "./ConfirmExitPopup.css"; // 같은 CSS 사용
import closePopupIcon from "../../assets/icons/closePopup.png";
import cancelButtonIcon from "../../assets/icons/cancelSaveButton.png";
import saveButtonIcon from "../../assets/icons/confirmSaveButton.png";

export default function ConfirmSavePopup({ onCancel, onConfirmSave, onClose }) {
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
          저장할까요?<br />
          지금까지 입력한 내용이 반영돼요
        </div>
        
        {/* 버튼 영역 */}
        <div className="popup-buttons">
          <img 
            src={cancelButtonIcon} 
            className="popup-button" 
            onClick={onCancel}
            alt="취소"
          />
          <img 
            src={saveButtonIcon} 
            className="popup-button" 
            onClick={onConfirmSave}
            alt="저장"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}