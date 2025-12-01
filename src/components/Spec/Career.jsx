import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Career.css";
import chipIcon from "../../assets/icons/Career.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

const Career = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // UI state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // form state
  const [companyName, setCompanyName] = useState("");
  const [employmentType, setEmploymentType] = useState(""); // e.g. "intern", "individual", "contract", "freelancer"
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

  // 파일 handlers (UI only for now)
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
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

              {/* 회사명 */}
              <div className="form-field-frame">
                <label className="form-field-label">회사명</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="회사명을 입력해 주세요"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              {/* 참여 형태 - radio */}
              <div className="form-row">
                <div className="form-field-frame field-participation-type">
                  <label className="form-field-label">참여 형태</label>
                  <div className="award-input-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="participation"
                        value="contract"
                        checked={employmentType === "contract"}
                        onChange={(e) => setEmploymentType(e.target.value)}
                      />{" "}
                      계약직
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="participation"
                        value="individual"
                        checked={employmentType === "individual"}
                        onChange={(e) => setEmploymentType(e.target.value)}
                      />{" "}
                      정규직
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="participation"
                        value="intern"
                        checked={employmentType === "intern"}
                        onChange={(e) => setEmploymentType(e.target.value)}
                      />{" "}
                      인턴
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="participation"
                        value="freelancer"
                        checked={employmentType === "freelancer"}
                        onChange={(e) => setEmploymentType(e.target.value)}
                      />{" "}
                      프리랜서
                    </label>
                  </div>
                </div>
              </div>

              {/* 직무/부서 */}
              <div className="form-row">
                <div className="form-field-frame field-team-role">
                  <label className="form-field-label">직무/부서</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="담당했던 부서나 직무를 입력해주세요"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                  />
                </div>
              </div>

              {/* 재직 기간 (시작 / 종료 / 재직중) */}
              <div className="form-row">
                <div className="form-field-frame field-duration">
                  <label className="form-field-label">재직 기간</label>

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

                    {/* 종료 (재직중이면 숨김) */}
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

                    {/* 재직중 토글 */}
                    <div className="toggle-box">
                      <span className="working-text">재직 중</span>

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

              {/* 관련 입력들: situation / task / action / result */}
              <div className="divider-line" />

              <div className="detail-fields">
                <div className="text-frame">
                  <div className="first-text-line">Situation (상황)</div>
                  <div className="second-text-line">
                    이 경험이 어떤 계기로, 어떤 배경에서 시작됐는지 알려주세요
                  </div>
                </div>
                <textarea
                  className="detail-textarea"
                  placeholder="팀 구성, 경험 주제, 당시 상황이 어땠는지 적어주세요"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                />

                <div className="text-frame">
                  <div className="first-text-line">Task (과제)</div>
                  <div className="second-text-line">
                    그 상황에서 맡은 역할이나 해결해야 했던 문제는 무엇이었나요?
                  </div>
                </div>
                <textarea
                  className="detail-textarea"
                  placeholder="구체적인 목표나 미션 중심으로 적어주세요"
                  value={taskDetail}
                  onChange={(e) => setTaskDetail(e.target.value)}
                />

                <div className="text-frame">
                  <div className="first-text-line">Action (행동)</div>
                  <div className="second-text-line">
                    목표를 달성하기 위해 어떤 행동을 했나요?
                  </div>
                </div>
                <textarea
                  className="detail-textarea"
                  placeholder="직접 수행한 일, 협업 방식, 사용한 툴 등을 중심으로 적어주세요"
                  value={actionDetail}
                  onChange={(e) => setActionDetail(e.target.value)}
                />

                <div className="text-frame">
                  <div className="first-text-line">Result (결과)</div>
                  <div className="second-text-line">
                    그 결과 어떤 변화나 성과가 있었나요?
                  </div>
                </div>
                <textarea
                  className="detail-textarea"
                  placeholder="수치나 결과물, 배운 점 등을 구체적으로 적어주세요"
                  value={resultDetail}
                  onChange={(e) => setResultDetail(e.target.value)}
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

                <label className="put-link-label" style={{ cursor: "pointer" }}>
                  링크 추가하기 +
                </label>

                {/* link input */}
                <input
                  type="text"
                  className="form-input"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  style={{ marginTop: 12 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
