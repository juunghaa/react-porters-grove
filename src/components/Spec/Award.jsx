import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Award.css";
import chipIcon from "../../assets/icons/Award.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const Award = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // 폼 데이터 상태 (API 필드명에 맞게 수정)
  const [formData, setFormData] = useState({
    awards_name: "",
    awards_grade: "",
    achievement_date: "",
    issuer: "",
    description: "",
    link_url: "",
  });

  // 날짜 입력용 상태
  const [achievementYear, setAchievementYear] = useState("");
  const [achievementMonth, setAchievementMonth] = useState("");

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
    return `${year}-${month.padStart(2, "0")}-01`;
  };

  // 취득일 업데이트
  const updateAchievementDate = (year, month) => {
    const date = formatDate(year, month);
    if (date) {
      setFormData((prev) => ({ ...prev, achievement_date: date }));
    }
  };

  // ⭐ 빈 값 필터링 함수
  const cleanFormData = (data) => {
    const cleaned = {};
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value === null || value === undefined || value === "") return;
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed) cleaned[key] = trimmed;
      } else {
        cleaned[key] = value;
      }
    });
    return cleaned;
  };

  // ⭐ API 호출 - 수상 생성
  const createAward = async (data) => {
    const access = localStorage.getItem("access");
    const cleanedData = cleanFormData(data);

    console.log("📤 전송할 데이터:", cleanedData);

    const response = await axios.post("/api/awards/", cleanedData, {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  // ⭐ 작성 완료 버튼 핸들러
  const handleSubmit = async () => {
    // 필수값 검증
    if (!formData.awards_name.trim()) {
      alert("공모전/대회명을 입력해주세요.");
      return;
    }

    if (!formData.awards_grade.trim()) {
      alert("수상 내역을 입력해주세요.");
      return;
    }

    if (!formData.achievement_date) {
      alert("수상일을 선택해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createAward(formData);
      console.log("✅ 수상 저장 성공:", result);

      alert("저장되었습니다!");
      navigate("/"); // 또는 상세 페이지로 이동: navigate(`/award/${result.id}`)
    } catch (error) {
      console.error("❌ 수상 저장 실패:", error);

      if (error.response?.data) {
        console.error("에러 상세:", error.response.data);
        alert(`저장에 실패했습니다: ${JSON.stringify(error.response.data)}`);
      } else {
        alert("저장에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsSubmitting(false);
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
            <button
              className="complete-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
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
                  value={formData.awards_name}
                  onChange={(e) =>
                    handleInputChange("awards_name", e.target.value)
                  }
                />
              </div>

              {/* 수상 내역 */}
              <div className="form-field-frame">
                <label className="form-field-label">수상 내역</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="수상한 등급 또는 상의 이름을 입력하세요"
                  value={formData.awards_grade}
                  onChange={(e) =>
                    handleInputChange("awards_grade", e.target.value)
                  }
                />
              </div>

              {/* 수상일 */}
              <div className="form-row">
                <div className="form-field-frame field-topic-group">
                  <label className="form-field-label">수상일</label>
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
                    placeholder="수여한 기관명을 입력하세요"
                    value={formData.issuer}
                    onChange={(e) =>
                      handleInputChange("issuer", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* 설명 (선택사항) */}
              <div className="form-field-frame">
                <label className="form-field-label">설명 (선택)</label>
                <textarea
                  className="form-input"
                  placeholder="수상과 관련된 추가 설명을 입력하세요"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows="4"
                />
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

                {/* 링크 URL */}
                <label
                  className="form-field-label"
                  style={{ marginTop: "16px" }}
                >
                  링크 URL
                </label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.link_url}
                  onChange={(e) =>
                    handleInputChange("link_url", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Award;
