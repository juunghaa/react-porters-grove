import React, { useState, useRef } from "react";
import LeftPanel from "../LeftPanel/LeftPanel";
import { useNavigate } from "react-router-dom";
import "./OutUnivPage.css";
import chipIcon from "../../assets/icons/external.png";
import uploadIcon from "../../assets/icons/cloud-arrow-up-fill.svg";

// ⭐ 활동 생성 API
const createActivity = async (data) => {
  const access = localStorage.getItem("access");
  
  const response = await fetch("https://grove.ajousw.kr/api/activities/", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${access}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "활동 저장에 실패했습니다.");
  }

  return response.json();
};

const OutUnivPage = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // ⭐ 폼 데이터 state
  const [formData, setFormData] = useState({
    title: "",                    // 활동명
    subject: "",                  // 내용 설명
    role: "",                     // 역할
    work_title: "",               // 직책 (회장/부회장/운영진/일반회원)
    period_start: "",             // 시작 기간 (YYYY-MM-DD)
    period_end: "",               // 종료 기간 (YYYY-MM-DD)
    situation: "",                // STAR-T: Situation
    task_detail: "",              // STAR-T: Task
    action_detail: "",            // STAR-T: Action
    result_detail: "",            // STAR-T: Result
    takeaway: "",                 // STAR-T: Taken
    link_url: "",                 // 링크 URL
    // 기본값들
    organization: "",
    host: "",
    participation_type: "team",
    is_awarded: false,
    award_detail: "",
    attachment: null,
    category_id: null,
    tag_ids: [],
    primary_tag_ids: [],
    secondary_tag_ids: [],
    role_items: []
  });

  // ⭐ 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ⭐ 라디오 버튼 변경 핸들러 - 직책
  const handleRoleTypeChange = (e) => {
    const roleMap = {
      'president': '회장',
      'vicepresident': '부회장',
      'coremember': '운영진',
      'member': '일반 회원'
    };
    setFormData(prev => ({
      ...prev,
      work_title: roleMap[e.target.value] || e.target.value
    }));
  };

  // ⭐ 날짜 변경 핸들러 (YYYY.MM -> YYYY-MM-DD)
  const handleDateChange = (type, part, value) => {
    const currentDate = type === 'start' ? formData.period_start : formData.period_end;
    const [year, month] = currentDate ? currentDate.split('-') : ['', ''];
    
    let newYear = part === 'year' ? value : year;
    let newMonth = part === 'month' ? value : month;
    
    const newDate = newYear && newMonth ? `${newYear}-${newMonth}-01` : '';
    
    setFormData(prev => ({
      ...prev,
      [type === 'start' ? 'period_start' : 'period_end']: newDate
    }));
  };

  // ⭐ 작성 완료 버튼 클릭
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert("활동명을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createActivity(formData);
      console.log("✅ 대외활동 저장 성공:", result);
      alert("저장되었습니다!");
      navigate("/");
      
    } catch (error) {
      console.error("❌ 대외활동 저장 실패:", error);
      alert(error.message || "저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⭐ 취소 버튼
  const handleCancel = () => {
    if (window.confirm("작성을 취소하시겠습니까? 입력한 내용이 사라집니다.")) {
      navigate(-1);
    }
  };

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

  // 날짜 파싱 헬퍼
  const getDatePart = (dateStr, part) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return part === 'year' ? year : month;
  };

  // 직책 역매핑
  const getRoleValue = () => {
    const roleReverseMap = {
      '회장': 'president',
      '부회장': 'vicepresident',
      '운영진': 'coremember',
      '일반 회원': 'member'
    };
    return roleReverseMap[formData.work_title] || '';
  };

  return (
    <div className="outuniv-page-container">
      <LeftPanel
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        onHomeClick={handleHomeClick}
        onCreateNew={handleCreateNew}
        onLogout={handleLogout}
        isProfileSettingsOpen={false}
      />
      <div className={`outuniv-content ${isCollapsed ? "expanded" : ""}`}>
        <div className="outuniv-main-box">
          <div className="outuniv-top-bar">
            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
            <div className="top-bar-center">
              <img src={chipIcon} alt="chip" className="chip-icon" />
              <span className="top-bar-title">경험 정리하기</span>
            </div>
            <button 
              className="complete-button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "저장 중..." : "작성 완료"}
            </button>
          </div>

          {/* 기본정보 + 관련자료 컨테이너 */}
          <div className="outuniv-main-content">
            {/*큰 박스: 기본정보*/}
            <div className="outuniv-form-container">
              {/* 기본정보 헤더 */}
              <div className="form-section-header">
                <h2 className="form-section-title">기본정보</h2>
              </div>
              {/* 구분선 */}
              <div className="divider-line"></div>

              {/* 대외활동명 프레임 */}
              <div className="form-field-frame">
                <label className="form-field-label">활동명</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="참여한 대외활동명을 입력하세요"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              {/* 내용설명 프레임 */}
              <div className="form-field-frame">
                <label className="form-field-label">내용 설명</label>
                <input
                  type="text"
                  name="subject"
                  className="form-input"
                  placeholder="활동의 목적과 주요 미션을 간단히 적어주세요"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>

              {/* 역할, 직책 프레임 */}
              <div className="form-row">
                <div className="form-field-frame field-entry-name">
                  <label className="form-field-label">역할</label>
                  <input
                    type="text"
                    name="role"
                    className="form-input"
                    placeholder="이 경험에서 어떤 일을 했는지 적어주세요"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-field-frame field-award-status">
                  <label className="form-field-label">직책</label>
                  <div className="award-input-group">
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="role" 
                        value="president"
                        checked={getRoleValue() === 'president'}
                        onChange={handleRoleTypeChange}
                      />
                      회장
                    </label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="role" 
                        value="vicepresident"
                        checked={getRoleValue() === 'vicepresident'}
                        onChange={handleRoleTypeChange}
                      />
                      부회장
                    </label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="role" 
                        value="coremember"
                        checked={getRoleValue() === 'coremember'}
                        onChange={handleRoleTypeChange}
                      />
                      운영진
                    </label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="role" 
                        value="member"
                        checked={getRoleValue() === 'member'}
                        onChange={handleRoleTypeChange}
                      />
                      일반 회원
                    </label>
                  </div>
                </div>
              </div>

              {/* 활동 기간 */}
              <div className="form-row">
                <div className="form-field-frame field-duration">
                  <label className="form-field-label">활동 기간</label>
                  <div className="work-period-container">
                    {/* 시작일 */}
                    <div className="work-date-box">
                      <span className="work-date-label">시작</span>
                      <select
                        className="year-select"
                        value={getDatePart(formData.period_start, 'year')}
                        onChange={(e) => handleDateChange('start', 'year', e.target.value)}
                      >
                        <option value="" disabled>연도</option>
                        {Array.from({ length: 20 }, (_, i) => 2025 - i).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <select
                        className="month-select"
                        value={getDatePart(formData.period_start, 'month')}
                        onChange={(e) => handleDateChange('start', 'month', e.target.value)}
                      >
                        <option value="" disabled>월</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const m = (i + 1).toString().padStart(2, "0");
                          return <option key={m} value={m}>{m}</option>;
                        })}
                      </select>
                    </div>

                    {/* 종료일 */}
                    <div className="work-date-box">
                      <span className="work-date-label">종료</span>
                      <select
                        className="year-select"
                        value={getDatePart(formData.period_end, 'year')}
                        onChange={(e) => handleDateChange('end', 'year', e.target.value)}
                      >
                        <option value="" disabled>연도</option>
                        {Array.from({ length: 20 }, (_, i) => 2025 - i).map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      <select
                        className="month-select"
                        value={getDatePart(formData.period_end, 'month')}
                        onChange={(e) => handleDateChange('end', 'month', e.target.value)}
                      >
                        <option value="" disabled>월</option>
                        {Array.from({ length: 12 }, (_, i) => {
                          const m = (i + 1).toString().padStart(2, "0");
                          return <option key={m} value={m}>{m}</option>;
                        })}
                      </select>
                    </div>
                  </div>
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

                {/* 업로드된 파일 목록 */}
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-list">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="uploaded-file-item">
                        📄 {file.name}
                      </div>
                    ))}
                  </div>
                )}

                <label className="form-field-label" style={{ marginTop: "8px" }}>
                  링크 URL
                </label>
                <input
                  type="url"
                  name="link_url"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.link_url}
                  onChange={handleInputChange}
                />
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
                name="situation"
                className="detail-textarea"
                placeholder="어떤 배경이나 문제의식에서 출발했는지 들려주세요."
                value={formData.situation}
                onChange={handleInputChange}
              />

              {/* 두 번째 Task (과제) */}
              <div className="text-frame">
                <div className="first-text-line">Task (과제)</div>
                <div className="second-text-line">
                  그 상황에서 맡은 역할이나 해결해야 했던 문제는 무엇이었나요?
                </div>
              </div>

              <textarea
                name="task_detail"
                className="detail-textarea"
                placeholder="스스로 중요하다고 느꼈던 목표나 미션이 있었다면 함께 적어주세요."
                value={formData.task_detail}
                onChange={handleInputChange}
              />

              {/* 세번째 Action (행동) */}
              <div className="text-frame">
                <div className="first-text-line">Action (행동)</div>
                <div className="second-text-line">
                  그 목표를 이루기 위해 어떤 시도를 했나요?
                </div>
              </div>

              <textarea
                name="action_detail"
                className="detail-textarea"
                placeholder="그 방식을 선택한 이유나 과정에서 고민했던 점이 있다면 함께 적어주세요."
                value={formData.action_detail}
                onChange={handleInputChange}
              />

              {/* 네번째 Result (결과) */}
              <div className="text-frame">
                <div className="first-text-line">Result (결과)</div>
                <div className="second-text-line">
                  그 결과 어떤 변화나 성과가 있었나요?
                </div>
              </div>

              <textarea
                name="result_detail"
                className="detail-textarea"
                placeholder="수치나 결과물, 배운 점 등을 구체적으로 적어주세요."
                value={formData.result_detail}
                onChange={handleInputChange}
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
                name="takeaway"
                className="detail-textarea"
                placeholder="앞으로 같은 상황이 온다면, 어떻게 접근하고 싶은지 적어주세요"
                value={formData.takeaway}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutUnivPage;