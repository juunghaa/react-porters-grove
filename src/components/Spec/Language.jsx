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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 언어 정보 state
  const [experienceType, setExperienceType] = useState("");
  const [customLanguage, setCustomLanguage] = useState("");
  const [proficiencyLevel, setProficiencyLevel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  // 어학 시험 배열 state
  const [languageTests, setLanguageTests] = useState([]);

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
        id: Date.now(),
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

  // ⭐ API 호출 - 외국어 정보 생성
  const createForeignLanguage = async (data) => {
    const access = localStorage.getItem("access");
    const cleanedData = cleanFormData(data);

    console.log("📤 전송할 데이터:", cleanedData);

    const response = await axios.post("/api/foreignlangs/", cleanedData, {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  // ⭐ 제출 함수
  const handleSubmit = async () => {
    // 필수값 검증
    const langName =
      experienceType === "custom" ? customLanguage : experienceType;

    if (!langName.trim()) {
      alert("언어를 선택하거나 입력해주세요.");
      return;
    }

    if (!proficiencyLevel) {
      alert("구사 수준을 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 어학 시험이 있는 경우
      if (languageTests.length > 0) {
        // 각 어학 시험마다 별도의 API 요청
        for (const test of languageTests) {
          const body = {
            lang_name: langName,
            lang_level: proficiencyLevel,
            exam_name: test.testName || null,
            exam_grade: test.score || null,
            achievement_date: test.acquisitionDate || null,
            link_url: linkUrl || null,
          };

          await createForeignLanguage(body);
        }
      } else {
        // 어학 시험 없이 언어 정보만 저장
        const body = {
          lang_name: langName,
          lang_level: proficiencyLevel,
          link_url: linkUrl || null,
        };

        await createForeignLanguage(body);
      }

      console.log("✅ 외국어 정보 저장 성공");
      alert("저장되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("❌ 외국어 정보 저장 실패:", error);

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
            <button
              className="complete-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "작성 완료"}
            </button>
          </div>

          <div className="contest-main-content">
            <div className="contest-form-container">
              <div className="form-section-header">
                <h2 className="form-section-title">기본정보</h2>
              </div>
              <div className="divider-line" />

              {/* 언어 선택 */}
              <div className="form-field-frame">
                <label className="form-field-label">언어</label>
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
              </div>

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
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                />
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
                      placeholder="어학 시험의 이름을 입력하세요 (예: TOEIC, TOEFL)"
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
                      placeholder="취득한 점수나 등급을 입력하세요 (예: 900점, B2)"
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
