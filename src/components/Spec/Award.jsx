import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import "./Award.css";
import chipIcon from "../../assets/icons/Award.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const Award = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    c_name: "",
    issuer: "",
    achievement_date: "",
    expiration_date: "",
    description: "",
    link_url: "",
  });

  // 날짜 입력용 상태
  const [achievementYear, setAchievementYear] = useState("");
  const [achievementMonth, setAchievementMonth] = useState("");

  const [expirationYear, setExpirationYear] = useState("");
  const [expirationMonth, setExpirationMonth] = useState("");

  const [hasExpiry, setHasExpiry] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 날짜 형식 변환 (YYYY-MM-DD)
  const formatDate = (year, month) => {
    if (!year || !month) return "";
    // 기본적으로 1일로 설정
    return `${year}-${month.padStart(2, "0")}-01`;
  };

  // 취득일 업데이트
  const updateAchievementDate = (year, month) => {
    const date = formatDate(year, month);
    if (date) {
      setFormData((prev) => ({ ...prev, achievement_date: date }));
    }
  };

  // 만료일 업데이트
  const updateExpirationDate = (year, month) => {
    const date = formatDate(year, month);
    if (date) {
      setFormData((prev) => ({ ...prev, expiration_date: date }));
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    if (
      window.confirm(
        "작성을 취소하시겠습니까? 입력한 내용이 저장되지 않습니다."
      )
    ) {
      navigate(-1);
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleRemoveFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
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
    <div className="contest-page-container">
      <LeftPanel
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        onHomeClick={handleHomeClick}
        onCreateNew={handleCreateNew}
        onLogout={handleLogout}
        isProfileSettingsOpen={false}
      />

      <div className={`contest-content ${isCollapsed ? "expanded" : ""}`}>
        <div className="contest-main-box">
          <div className="contest-top-bar">
            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
            <div className="top-bar-center">
              <img src={chipIcon} alt="chip" className="chip-icon" />
              <span className="top-bar-title">스펙 정리하기</span>
            </div>
            <button className="complete-button" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "작성 완료"}
            </button>
          </div>

          {/* 메인 내용 */}
          <div className="contest-main-content">
            {/* 기본정보 */}
            <div className="contest-form-container">
              <div className="form-section-header">
                <h2 className="form-section-title">기본정보</h2>
              </div>
              <div className="divider-line"></div>

              {/* 공모전/대회명 */}
              <div className="form-field-frame">
                <label className="form-field-label">공모전/대회명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="참여한 공모전 또는 대회의 이름을 입력하세요"
                  value={formData.c_name}
                  onChange={(e) => handleInputChange("c_name", e.target.value)}
                />
              </div>

              {/* 수상 내역 */}
              <div className="form-field-frame">
                <label className="form-field-label">수상 내역</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="수상한 등급 또는 상의 이름을 입력하세요"
                  value={formData.c_name}
                  onChange={(e) => handleInputChange("c_name", e.target.value)}
                />
              </div>

              {/* 수상일 */}
              <div className="form-row">
                <div className="form-field-frame field-topic-group">
                  <label className="form-field-label">수상일</label>
                  {/* 수상일 */}
                  <div className="work-date-box">
                    <span className="work-date-label">수상일</span>

                    <select
                      className="year-select"
                      value={achievementYear}
                      onChange={(e) => {
                        setAchievementYear(e.target.value);
                        updateAchievementDate(e.target.value, achievementMonth);
                      }}
                    >
                      <option value="" disabled>
                        연도
                      </option>
                      {Array.from({ length: 20 }, (_, i) => 2025 - i).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        )
                      )}
                    </select>

                    <select
                      className="month-select"
                      value={achievementMonth}
                      onChange={(e) => {
                        setAchievementMonth(e.target.value);
                        updateAchievementDate(achievementYear, e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        월
                      </option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const m = (i + 1).toString().padStart(2, "0");
                        return (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className="form-field-frame field-organizer">
                  <label className="form-field-label">주관/수여기관</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="수상한 등급 또는 상의 이름을 입력하세요"
                  />
                </div>
              </div>
            </div>

            {/* 관련자료 */}
            <div className="related-materials-container">
              <div className="form-section-header">
                <h2 className="form-section-title">관련자료</h2>
              </div>
              <div className="file-divider-line"></div>

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

                {/* 업로드된 파일 목록 */}
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        <span className="file-name">{file.name}</span>
                        <button
                          className="remove-file-btn"
                          onClick={() => handleRemoveFile(index)}
                          type="button"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="put-link-label" style={{ cursor: "pointer" }}>
                  링크 추가하기 +
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Award;
