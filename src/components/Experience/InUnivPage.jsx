import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import "./InUnivPage.css";
import chipIcon from "../../assets/icons/InUniv.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const InUnivPage = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleCreateNew = () => {
    navigate("/choose");
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  return (
    <div className="inuniv-page-container">
      <LeftPanel
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        onHomeClick={handleHomeClick}
        onCreateNew={handleCreateNew}
        onLogout={handleLogout}
        isProfileSettingsOpen={false}
      />
      <div className={`inuniv-content ${isCollapsed ? "expanded" : ""}`}>
        <div className="inuniv-main-box">
          <div className="inuniv-top-bar">
            <button className="cancel-button">취소</button>
            <div className="top-bar-center">
              <img src={chipIcon} alt="chip" className="chip-icon" />
              <span className="top-bar-title">경험 정리하기</span>
            </div>
            <button className="complete-button">작성 완료</button>
          </div>

          {/* 기본정보 + 관련자료 컨테이너 */}
          <div className="inuniv-main-content">
            {/*큰 박스: 기본정보*/}
            <div className="inuniv-form-container">
              {/* 기본정보 헤더 */}
              <div className="form-section-header">
                <h2 className="form-section-title">기본정보</h2>
              </div>
              {/* 구분선 */}
              <div className="divider-line"></div>

              {/* 프로그램명 프레임 */}
              <div className="form-field-frame">
                <label className="form-field-label">프로그램명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="참여한 교내 프로그램명을 입력하세요"
                />
              </div>

              {/* 내용설명 프레임 */}
              <div className="form-field-frame">
                <label className="form-field-label">내용 설명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="어떤 목적의 프로그램이었는지, 주요 활동이나 배운점을 간단히 적어주세요 "
                />
              </div>

              {/* 주관부서, 역할 프레임 */}
              <div className="form-row">
                <div className="form-field-frame field-topic-group">
                  <label className="form-field-label">주관 부서</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ width: "304px" }}
                    placeholder="주관 부서의 이름을 입력하세요"
                  />
                </div>

                <div className="form-field-frame field-organizer">
                  <label className="form-field-label">역할</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="이 경험에서 어떤 일을 했는지 적어주세요"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field-frame field-duration">
                  <label className="form-field-label">활동 기간</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="시작기간 - 종료기간"
                  />
                </div>
              </div>
            </div>

            {/* 관련자료 컴포넌트 */}
            <div className="related-materials-container">
              <div className="form-section-header">
                <h2 className="form-section-title">관련자료</h2>
              </div>
              <div className="file-divider-line"></div>

              {/* 관련자료 내용이 들어갈 영역 */}
              <div className="materials-content">
                <label className="form-field-label">파일 업로드</label>
                <div className="file-upload-box">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                  <div
                    className="upload-frame"
                    onClick={handleUploadClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="upload-icon">
                      <img src={uploadIcon} alt="upload" />
                    </div>
                    <div className="upload-text">
                      파일을 선택하거나 여기로 끌어다 놓으세요
                    </div>
                  </div>
                </div>
                <label
                  className="put-link-label"
                  onClick={handleUploadClick}
                  style={{ cursor: "pointer" }}
                >
                  링크 추가하기 +
                </label>
              </div>
            </div>
          </div>

          <div className="detail-content-container">
            <div className="form-section-header">
              <h2 className="form-section-title">세부 내용</h2>
            </div>
            <div className="divider-line"></div>
            {/* 세부 내용이 들어갈 영역 */}
            <div className="detail-fields">
              <div className="text-frame">
                <div className="first-text-line">Situation (상황)</div>
                <div className="second-text-line">
                  이 경험은 어떤 계기로 시작했나요?
                </div>
              </div>
              <textarea
                className="detail-textarea"
                placeholder="어떤 배경이나 문제의식에서 출발했는지 들려주세요."
              />

              {/* 두 번째 Task (과제) */}
              <div className="text-frame">
                <div className="first-text-line">Task (과제)</div>
                <div className="second-text-line">
                  그 상황에서 맡은 역할이나 해결해야 했던 문제는 무엇이었나요?
                </div>
              </div>

              <textarea
                className="detail-textarea"
                placeholder="스스로 중요하다고 느꼈던 목표나 미션이 있었다면 함께 적어주세요."
              />

              {/* 세번째 Action (행동) */}
              <div className="text-frame">
                <div className="first-text-line">Action (행동)</div>
                <div className="second-text-line">
                  그 목표를 이루기 위해 어떤 시도를 했나요?
                </div>
              </div>

              <textarea
                className="detail-textarea"
                placeholder="그 방식을 선택한 이유나 과정에서 고민했던 점이 있다면 함께 적어주세요."
              />

              {/* 네번째 Result (결과) */}
              <div className="text-frame">
                <div className="first-text-line">Result (결과)</div>
                <div className="second-text-line">
                  그 결과 어떤 변화나 성과가 있었나요?
                </div>
              </div>

              <textarea
                className="detail-textarea"
                placeholder="수치나 결과물, 배운 점 등을 구체적으로 적어주세요."
              />

              {/* 다섯번째 Taken (교훈) */}
              <div className="text-frame">
                <div className="first-text-line">Taken (교훈)</div>
                <div className="second-text-line">
                  이 경험을 통해 새롭게 깨달은 점이나 다음에 바꾸고 싶은 점이
                  있나요?
                </div>
              </div>

              <textarea
                className="detail-textarea"
                placeholder="앞으로 같은 상황이 온다면, 어떻게 접근하고 싶은지 적어주세요"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InUnivPage;
