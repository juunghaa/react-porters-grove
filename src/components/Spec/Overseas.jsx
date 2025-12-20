import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Overseas.css";
import chipIcon from "../../assets/icons/overseas.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const Overseas = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // UI state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [experienceType, setExperienceType] = useState("");

  // form state
  const [companyName, setCompanyName] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [position, setPosition] = useState("");

  const [startDate, setStartDate] = useState(""); // format "YYYY.MM"
  const [endDate, setEndDate] = useState(""); // format "YYYY.MM"
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

  // API instance (optional: set baseURL if needed)
  const api = axios.create({
    baseURL: "/", // 필요하면 "https://api.example.com" 으로 변경
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
      period_start: yyyymmToIsoDate(startDate), // e.g. "2024-08-01"
      period_end: isWorking ? null : yyyymmToIsoDate(endDate),
      is_current: isWorking,
      situation: situation,
      task_detail: taskDetail,
      action_detail: actionDetail,
      result_detail: resultDetail,
      link_url: linkUrl || null,
    };

    try {
      const res = await api.post("/api/careers/", body, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 성공 처리
      alert("경력 정보가 저장되었습니다.");
      // 이동하거나 상태 업데이트
      navigate("/"); // 원하는 페이지로 변경
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

              {/* 구분 */}
              <select
                className="form-input select-experience"
                value={experienceType}
                onChange={(e) => setExperienceType(e.target.value)}
                data-placeholder={experienceType === "" ? "true" : "false"}
              >
                <option value="" disabled>
                  경험 유형을 입력하세요
                </option>
                <option value="거주">거주</option>
                <option value="장기 출장">장기 출장</option>
                <option value="워킹홀리데이">워킹홀리데이</option>
                <option value="어학 연수">어학 연수</option>
                <option value="교환학생">교환학생</option>
                <option value="주재원 파견">주재원 파견</option>
              </select>

              {/* 국가명 */}
              <div className="form-field-frame">
                <label className="form-field-label">국가명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="국가명을 입력해 주세요"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {/*사용언어*/}
              <div className="form-row">
                <div className="form-field-frame field-team-role">
                  <label className="form-field-label">사용언어</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="해당 경험에서 주로 사용한 언어를 입력해주세요"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              </div>

              {/* 기간*/}
              <div className="form-row">
                <div className="form-field-frame field-duration">
                  <label className="form-field-label">기간</label>

                  <div className="work-period-container">
                    {/* 시작 */}
                    <div className="work-date-box">
                      <span className="work-date-label">시작</span>

                      <select
                        className="year-select"
                        value={startDate.split(".")[0] || ""}
                        onChange={(e) => {
                          const year = e.target.value;
                          const month = startDate.split(".")[1] || "01";
                          setStartDate(`${year}.${month}`);
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
                        value={startDate.split(".")[1] || ""}
                        onChange={(e) => {
                          const month = e.target.value;
                          const year = startDate.split(".")[0] || "2025";
                          setStartDate(`${year}.${month}`);
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

                    {/* 종료*/}
                    {!isWorking && (
                      <div className="work-date-box">
                        <span className="work-date-label">종료</span>

                        <select
                          className="year-select"
                          value={endDate?.split(".")[0] || ""}
                          onChange={(e) => {
                            const year = e.target.value;
                            const month = endDate?.split(".")[1] || "01";
                            setEndDate(`${year}.${month}`);
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
                          value={endDate?.split(".")[1] || ""}
                          onChange={(e) => {
                            const month = e.target.value;
                            const year = endDate?.split(".")[0] || "2025";
                            setEndDate(`${year}.${month}`);
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

                    {/* 진행중 토글 */}
                    <div className="toggle-box">
                      <span className="working-text">진행 중</span>

                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={isWorking}
                          onChange={() => {
                            setIsWorking(!isWorking);
                            if (!isWorking) setEndDate("");
                          }}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
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

export default Overseas;
