import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Language.css";
import chipIcon from "../../assets/icons/language.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const Language = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // UI state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [experienceType, setExperienceType] = useState("");
  const [language, setLanguage] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");

  // 어학 시험 배열 state 추가
  const [languageTests, setLanguageTests] = useState([]);

  // form state
  const [companyName, setCompanyName] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [position, setPosition] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const [situation, setSituation] = useState("");
  const [taskDetail, setTaskDetail] = useState("");
  const [actionDetail, setActionDetail] = useState("");
  const [resultDetail, setResultDetail] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // helper: format YYYY.MM -> YYYY-MM-01 (or null)
  const yyyymmToIsoDate = (val) => {
    if (!val) return null;
    const parts = val.split(".");
    if (parts.length !== 2) return null;
    const year = parts[0];
    const month = parts[1].padStart(2, "0");
    return `${year}-${month}-01`;
  };

  // API instance
  const api = axios.create({
    baseURL: "/",
    headers: { "Content-Type": "application/json" },
  });

  // navigation & leftpanel handlers
  const handleToggle = () => setIsCollapsed(!isCollapsed);
  const handleHomeClick = () => navigate("/");
  const handleCreateNew = () => navigate("/choose");
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  // 구사 수준 라디오 버튼 핸들러
  const handleProficiencyChange = (e) => {
    setProficiencyLevel(e.target.value);
  };

  // 어학 시험 추가 핸들러
  const handleAddLanguageTest = () => {
    setLanguageTests([
      ...languageTests,
      {
        id: Date.now(), // 고유 ID
        testName: "",
        score: "",
        acquisitionDate: "",
      },
    ]);
  };

  // 어학 시험 삭제 핸들러
  const handleRemoveLanguageTest = (id) => {
    setLanguageTests(languageTests.filter((test) => test.id !== id));
  };

  // 어학 시험 입력값 변경 핸들러
  const handleLanguageTestChange = (id, field, value) => {
    setLanguageTests(
      languageTests.map((test) =>
        test.id === id ? { ...test, [field]: value } : test
      )
    );
  };

  // 파일 handlers
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };
  const handleRemoveFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // === 제출 함수 ===
  const handleSubmit = async () => {
    if (!companyName.trim()) return alert("회사명을 입력해 주세요.");
    if (!employmentType) return alert("참여 형태를 선택해 주세요.");
    if (!position.trim()) return alert("직무/부서를 입력해 주세요.");
    if (!startDate) return alert("시작일을 선택해 주세요.");
    if (!isWorking && !endDate)
      return alert("종료일을 선택하거나 '재직 중'을 체크하세요.");

    const token = localStorage.getItem("access");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const body = {
      company_name: companyName,
      employment_type: employmentType,
      position: position,
      period_start: yyyymmToIsoDate(startDate),
      period_end: isWorking ? null : yyyymmToIsoDate(endDate),
      is_current: isWorking,
      situation: situation,
      task_detail: taskDetail,
      action_detail: actionDetail,
      result_detail: resultDetail,
      link_url: linkUrl || null,
      language_tests: languageTests, // 어학 시험 데이터 추가
    };

    try {
      const res = await api.post("/api/careers/", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("경력 정보가 저장되었습니다.");
      navigate("/");
    } catch (err) {
      console.error("POST /api/careers/ error:", err.response?.data || err);
      const message =
        err.response?.data?.detail || "저장 중 오류가 발생했습니다.";
      alert(message);
    }
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
            <button className="cancel-button" onClick={() => navigate(-1)}>
              취소
            </button>
            <div className="top-bar-center">
              <img src={chipIcon} alt="chip" className="chip-icon" />
              <span className="top-bar-title">스펙 정리하기</span>
            </div>
            <button className="complete-button" onClick={handleSubmit}>
              작성 완료
            </button>
          </div>

          <div className="contest-main-content">
            <div className="contest-form-container">
              <div className="form-section-header">
                <h2 className="form-section-title">기본정보</h2>
              </div>
              <div className="divider-line" />

              <select
                className="form-input select-experience"
                value={experienceType}
                onChange={(e) => setExperienceType(e.target.value)}
              >
                <option value="" disabled>
                  언어를 선택하세요
                </option>
                <option value="영어">영어 (English)</option>
                <option value="프랑스어">프랑스어 (Français)</option>
                <option value="독일어">독일어 (Deutsch)</option>
                <option value="스페인어">스페인어 (Español)</option>
                <option value="이탈리아어">이탈리아어 (Italiano)</option>
                <option value="일본어">일본어 (日本語)</option>
                <option value="중국어">중국어 (中文)</option>
                <option value="러시아어">러시아어 (Русский)</option>
                <option value="포르투갈어">포르투갈어 (Português)</option>
                <option value="아랍어">아랍어 (العربية)</option>
                <option value="custom">기타 (직접입력)</option>
              </select>

              {experienceType === "custom" && (
                <input
                  type="text"
                  className="form-input"
                  placeholder="사용한 언어를 직접 입력하세요"
                  value={customLanguage}
                  onChange={(e) => setCustomLanguage(e.target.value)}
                  style={{ marginTop: "8px" }}
                />
              )}

              {/* 구사 수준 */}
              <div className="form-row">
                <div className="form-field-frame field-proficiency">
                  <label className="form-field-label">구사 수준</label>
                  <div className="award-input-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="proficiency"
                        value="conversational"
                        checked={proficiencyLevel === "conversational"}
                        onChange={handleProficiencyChange}
                      />
                      일상 회화
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="proficiency"
                        value="business"
                        checked={proficiencyLevel === "business"}
                        onChange={handleProficiencyChange}
                      />
                      비즈니스 회화
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="proficiency"
                        value="native"
                        checked={proficiencyLevel === "native"}
                        onChange={handleProficiencyChange}
                      />
                      원어민 수준
                    </label>
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
                      파일을 선택하거나 끌어다 놓으세요
                    </div>
                  </div>
                </div>

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

          {/* 어학 시험 추가하기 섹션 */}
          <div className="language-test-section">
            <button
              className="add-language-test-btn"
              onClick={handleAddLanguageTest}
            >
              어학 시험 추가하기 +
            </button>

            {/* 어학 시험 목록 */}
            {languageTests.map((test, index) => (
              <div key={test.id} className="language-test-container">
                <div className="language-test-header">
                  <h3 className="language-test-title">어학 시험 {index + 1}</h3>
                  <button
                    className="remove-test-btn"
                    onClick={() => handleRemoveLanguageTest(test.id)}
                  >
                    ✕
                  </button>
                </div>

                <div className="language-test-fields">
                  {/* 시험명 */}
                  <div className="test-field">
                    <label className="test-field-label">시험명</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="어학 시험의 이름을 입력하세요"
                      value={test.testName}
                      onChange={(e) =>
                        handleLanguageTestChange(
                          test.id,
                          "testName",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* 점수/등급 */}
                  <div className="test-field">
                    <label className="test-field-label">점수/등급</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="취득한 점수나 등급을 입력하세요"
                      value={test.score}
                      onChange={(e) =>
                        handleLanguageTestChange(
                          test.id,
                          "score",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  {/* 취득일 */}
                  <div className="test-field">
                    <label className="test-field-label">취득일</label>
                    <input
                      type="date"
                      className="form-input"
                      value={test.acquisitionDate}
                      onChange={(e) =>
                        handleLanguageTestChange(
                          test.id,
                          "acquisitionDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Language;
