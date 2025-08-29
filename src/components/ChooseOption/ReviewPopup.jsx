import React, { useState } from "react";
import "./ChooseOption.css";
import "./ReviewPopup.css";

const ReviewPopup = ({ onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState("AAR-기본");

  const renderTemplateDetails = () => {
    switch (selectedTemplate) {
      case "AAR-기본":
        return (
          <>
            <div className="title-and-time-container">
              <h3 className="detail-title">AAR・기본</h3>
              <span className="detail-time">5분</span>
            </div>
            <p className="detail-description">
              작은 프로젝트나 활동을 빠르게 돌아보고 싶을 때 쓰는 회고
              방법이에요.
            </p>

            <div className="detail-section">
              <h4 className="section-title">AAR은 이런 방식이에요</h4>
              <p className="section-text">
                After Action Review. 활동이 끝난 뒤, 목표 → 사실 → 잘한 점 →
                아쉬운 점 → 다음 액션 이렇게 다섯 단계로 짧게 정리합니다.
              </p>
            </div>
            <div className="detail-section">
              <h4 className="section-title">이럴 때 딱 맞아요</h4>
              <p className="section-text">
                해커톤, 공모전처럼 단기 프로젝트가 끝났을 때 짧게 진행한 사이드
                작업이나 발표를 정리할 때 길게 쓰기보다는, 핵심만 빠르게
                기록하고 싶을 때
              </p>
            </div>
            <div className="detail-section">
              <h4 className="section-title">걸리는 시간</h4>
              <p className="section-text">
                보통 5분이면 충분해요. 부담 없이 시작하고, 다음 프로젝트로
                자연스럽게 넘어가세요.
              </p>
            </div>
          </>
        );
      case "AAR-정밀":
        return (
          <>
            <div className="title-and-time-container">
              <h3 className="detail-title">AAR・정밀</h3>
              <span className="detail-time">10-15분</span>
            </div>
            <p className="detail-description">
              깊이 있는 회고가 필요할 때 쓰는 템플릿이에요.
            </p>
            <div className="detail-section">
              <h4 className="section-title">AAR은 이런 방식이에요</h4>
              <p className="section-text">
                After Action Review. 활동이 끝난 뒤, 목표 → 사실 → 잘한 점 →
                아쉬운 점 → 다음 액션 이렇게 다섯 단계로 짧게 정리합니다.
              </p>
            </div>
            <div className="detail-section">
              <h4 className="section-title">이럴 때 딱 맞아요</h4>
              <p className="section-text">
                장기간 진행한 프로젝트나 인턴십을 돌아볼 때 결과뿐 아니라 과정,
                팀워크, 원인 분석까지 남기고 싶을 때 이후 활동에 참고할 자료로
                남겨두고 싶을 때
              </p>
            </div>
            <div className="detail-section">
              <h4 className="section-title">걸리는 시간</h4>
              <p className="section-text">
                보통 10-15분 정도 걸려요. 자세히 돌아보는 만큼, 다음 성장을 위한
                인사이트를 더 많이 얻을 수 있습니다.
              </p>
            </div>
          </>
        );
      case "KPT":
        return (
          <>
            <div className="title-and-time-container">
              <h3 className="detail-title">KPT</h3>
              <span className="detail-time">3분</span>
            </div>
            <p className="detail-description">
              빠르게 팀과 함께 진행할 때 쓰는 회고 방법이에요.
            </p>
            <div className="detail-section">
              <h4 className="section-title">KPT는 이런 방식이에요</h4>
              <p className="section-text">
                Keep(유지할 점), Problem(문제점), Try(시도할 점). 세 가지
                키워드를 중심으로 간단하게 의견을 주고받습니다.
              </p>
            </div>
            <div className="detail-section">
              <h4 className="section-title">이럴 때 딱 맞아요</h4>
              <p className="section-text">
                팀원과 함께 짧고 효율적으로 의견을 공유하고 싶을 때.
              </p>
            </div>
            <div className="detail-section">
              <h4 className="section-title">걸리는 시간</h4>
              <p className="section-text">
                보통 3분이면 충분합니다. 템플릿을 따라가면 금방 끝낼 수 있어요.
              </p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-left-panel">
          <h2 className="panel-title">회고 템플릿 선택</h2>
          <p className="panel-subtitle">나에게 맞는 회고 방법을 골라보세요.</p>
          <div className="template-options">
            <div
              className={`template-card ${
                selectedTemplate === "AAR-기본" ? "selected" : ""
              }`}
              onClick={() => setSelectedTemplate("AAR-기본")}
            >
              <span className="card-type">AAR・기본</span>
              <span className="card-time">5분</span>
            </div>
            <div
              className={`template-card ${
                selectedTemplate === "AAR-정밀" ? "selected" : ""
              }`}
              onClick={() => setSelectedTemplate("AAR-정밀")}
            >
              <span className="card-type">AAR・정밀</span>
              <span className="card-time">10-15분</span>
            </div>
            <div
              className={`template-card ${
                selectedTemplate === "KPT" ? "selected" : ""
              }`}
              onClick={() => setSelectedTemplate("KPT")}
            >
              <span className="card-type">KPT</span>
              <span className="card-time">3분</span>
            </div>
          </div>
          <button className="cancel-btn" onClick={onClose}>
            취소
          </button>
        </div>

        <div className="popup-right-panel">
          <div className="details-content">{renderTemplateDetails()}</div>
          <div className="startbutton-content">
            <button className="start-btn">이 템플릿으로 시작</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPopup;
