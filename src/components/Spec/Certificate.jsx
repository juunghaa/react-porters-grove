import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import "./Certificate.css";
import chipIcon from "../../assets/icons/certificate.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const CertificatePage = () => {
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

  // 자격증 생성 API 호출
  const createCertification = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("access");

      if (!token) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      // 필수 필드 검증
      if (!formData.c_name || !formData.issuer) {
        alert("자격증명과 발급 기관은 필수 입력 항목입니다.");
        setIsSubmitting(false);
        return;
      }

      if (!formData.achievement_date) {
        alert("취득일을 입력해주세요.");
        setIsSubmitting(false);
        return;
      }

      // FormData 생성 (파일 포함)
      const formDataToSend = new FormData();

      // 텍스트 데이터 추가
      formDataToSend.append("c_name", formData.c_name);
      formDataToSend.append("issuer", formData.issuer);
      formDataToSend.append("achievement_date", formData.achievement_date);

      if (formData.expiration_date) {
        formDataToSend.append("expiration_date", formData.expiration_date);
      }

      if (formData.description) {
        formDataToSend.append("description", formData.description);
      }

      if (formData.link_url) {
        formDataToSend.append("link_url", formData.link_url);
      }

      // 파일 추가
      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file, index) => {
          formDataToSend.append(`files`, file);
        });
      }

      // API 요청
      const response = await fetch("/api/certifications/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // FormData 사용 시 Content-Type 자동 설정되므로 제거
        },
        body: formDataToSend,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("자격증 생성 성공:", data);
        alert("자격증이 성공적으로 등록되었습니다!");
        navigate("/"); // 홈으로 이동
      } else {
        const errorData = await response.json();
        console.error("자격증 생성 실패:", errorData);
        alert("자격증 등록에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("API 호출 에러:", error);
      alert("서버와의 연결에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 작성 완료 버튼 핸들러
  const handleComplete = () => {
    createCertification();
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
              onClick={handleComplete}
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

              {/* 자격증명 */}
              <div className="form-field-frame">
                <label className="form-field-label">자격증명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="자격증명을 입력하세요"
                  value={formData.c_name}
                  onChange={(e) => handleInputChange("c_name", e.target.value)}
                />
              </div>

              {/* 발급 기관 */}
              <div className="form-row">
                <div className="form-field-frame">
                  <label className="form-field-label">발급 기관</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="자격증을 발급한 기관을 입력하세요"
                    value={formData.issuer}
                    onChange={(e) =>
                      handleInputChange("issuer", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* 취득일 & 만료일 */}
              <div className="form-row">
                <div className="form-field-frame">
                  <div className="work-period-container">
                    {/* 취득일 */}
                    <div className="work-date-box">
                      <span className="work-date-label">취득일</span>

                      <select
                        className="year-select"
                        value={achievementYear}
                        onChange={(e) => {
                          setAchievementYear(e.target.value);
                          updateAchievementDate(
                            e.target.value,
                            achievementMonth
                          );
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
                          updateAchievementDate(
                            achievementYear,
                            e.target.value
                          );
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

                    {/* 만료일 */}
                    {hasExpiry && (
                      <div className="work-date-box">
                        <span className="work-date-label">만료일</span>

                        <select
                          className="year-select"
                          value={expirationYear}
                          onChange={(e) => {
                            setExpirationYear(e.target.value);
                            updateExpirationDate(
                              e.target.value,
                              expirationMonth
                            );
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
                          value={expirationMonth}
                          onChange={(e) => {
                            setExpirationMonth(e.target.value);
                            updateExpirationDate(
                              expirationYear,
                              e.target.value
                            );
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
                    )}
                  </div>
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

export default CertificatePage;
