import React, { useState } from "react";
import { Calendar, Plus, Minus } from "lucide-react";
import "./Activity.css";

const Activity = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true); // 사이드바 보이기/숨기기 상태 추가
  const [formData, setFormData] = useState({
    activityName: "",
    startDate: "",
    endDate: "",
    organization: "",
    roles: {
      planning: 1,
      design: 0,
      development: 2,
    },
    customRoles: {},
  });

  const steps = [
    { id: 1, label: "기본 정보" },
    { id: 2, label: "태그 설정" },
    { id: 3, label: "활동 상세" },
    { id: 4, label: "성과 & 결과" },
    { id: 5, label: "자료첨부" },
  ];

  const totalMembers =
    Object.values(formData.roles).reduce((a, b) => a + b, 0) +
    Object.values(formData.customRoles).reduce((a, b) => a + b, 0);

  const handleRoleChange = (role, delta, isCustom = false) => {
    if (isCustom) {
      setFormData((prev) => ({
        ...prev,
        customRoles: {
          ...prev.customRoles,
          [role]: Math.max(0, (prev.customRoles[role] || 0) + delta),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        roles: {
          ...prev.roles,
          [role]: Math.max(0, prev.roles[role] + delta),
        },
      }));
    }
  };

  const [newRole, setNewRole] = useState("");
  const addCustomRole = () => {
    if (newRole.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      customRoles: { ...prev.customRoles, [newRole]: 0 },
    }));
    setNewRole("");
  };

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="activity-page">
      <div className="layout-container">
        {/* 좌측 단계 네비게이션 */}
        {isSidebarVisible && (
          <div className="activity-sidebar">
            <div className="sidebar-logo">
              <span className="logo-icon">●</span> Grove
            </div>
            <div className="step-list">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`step-item ${
                    currentStep === step.id ? "active" : "inactive"
                  }`}
                  onClick={() => setCurrentStep(step.id)}
                >
                  <span>
                    {step.id}. {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 중앙 컨텐츠 & 우측 미리보기 컨테이너 */}
        <div
          className={`main-content-wrapper ${
            !isSidebarVisible ? "full-width" : ""
          }`}
        >
          <div className="main-header">
            <h1 className="main-title">활동정리</h1>
            {/* 사이드바 토글 버튼 */}
            <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
              {isSidebarVisible ? "단계 숨기기" : "단계 띄우기"}
            </button>
          </div>
          <div className="content-container">
            {/* 중앙 컨텐츠 */}
            <div className="main-content">
              {currentStep === 1 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">기본 정보</h2>
                    <p className="section-subtitle">
                      활동의 기본적인 정보를 입력해주세요.
                    </p>
                  </div>

                  {/* 활동명 */}
                  <div className="form-group">
                    <label>활동명 *</label>
                    <input
                      type="text"
                      value={formData.activityName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          activityName: e.target.value,
                        })
                      }
                      placeholder="활동명을 입력하세요"
                    />
                  </div>

                  {/* 활동기간 */}
                  <div className="form-group">
                    <label>활동 기간*</label>
                    <div className="date-row">
                      <div className="date-input-container">
                        <input
                          type="text"
                          placeholder="년-월-일"
                          value={formData.startDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                            })
                          }
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (e.target.type = "text")}
                        />
                        <Calendar size={18} className="calendar-icon" />
                      </div>
                      <span className="date-separator">~</span>
                      <div className="date-input-container">
                        <input
                          type="text"
                          placeholder="년-월-일"
                          value={formData.endDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                            })
                          }
                          onFocus={(e) => (e.target.type = "date")}
                          onBlur={(e) => (e.target.type = "text")}
                        />
                        <Calendar size={18} className="calendar-icon" />
                      </div>
                    </div>
                  </div>

                  {/* 소속 */}
                  <div className="form-group">
                    <label>소속 팀/회사*</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      placeholder="예 : 한국대학교, abc 스타트업"
                    />
                  </div>

                  {/* 팀 구성 섹션 */}
                  <div className="form-group team-composition-group">
                    <label>팀 구성*</label>
                    <div className="team-composition-content">
                      <div className="team-roles-input">
                        <div className="role-tags">
                          {[
                            { key: "planning", label: "기획" },
                            { key: "design", label: "디자인" },
                            { key: "development", label: "개발" },
                          ].map(({ key, label }) => (
                            <div key={key} className="role-tag">
                              <span>{label}</span>
                              <button onClick={() => handleRoleChange(key, -1)}>
                                <Minus size={12} />
                              </button>
                              <span>{formData.roles[key]}</span>
                              <button onClick={() => handleRoleChange(key, 1)}>
                                <Plus size={12} />
                              </button>
                            </div>
                          ))}
                          {Object.keys(formData.customRoles).map((role) => (
                            <div key={role} className="role-tag custom">
                              <span>{role}</span>
                              <button
                                onClick={() => handleRoleChange(role, -1, true)}
                              >
                                <Minus size={12} />
                              </button>
                              <span>{formData.customRoles[role]}</span>
                              <button
                                onClick={() => handleRoleChange(role, 1, true)}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="add-role-row">
                          <input
                            type="text"
                            placeholder="직접 입력하여 역할 추가하기"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                          />
                          <button onClick={addCustomRole}>+</button>
                          <span>추가</span>
                        </div>
                      </div>

                      {/* 팀 구성 요약 */}
                      <div className="team-summary">
                        <p className="summary-title">팀 구성 요약</p>
                        <p>
                          총 <span className="highlight">{totalMembers}명</span>
                          으로 구성된 팀
                        </p>
                        <p className="role-breakdown">
                          {Object.entries({
                            ...formData.roles,
                            ...formData.customRoles,
                          })
                            .filter(([_, count]) => count > 0)
                            .map(([role, count]) => `${role} ${count}명`)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">태그 설정</h2>
                    <p className="section-subtitle">
                      활동과 관련된 태그를 설정해주세요.
                    </p>
                  </div>
                  {/* 태그 설정 관련 입력 필드 */}
                  <div className="form-group">
                    <label>주요 태그</label>
                    <input type="text" placeholder="예: 프로젝트, 웹 개발" />
                  </div>
                  <div className="form-group">
                    <label>보조 태그</label>
                    <input type="text" placeholder="예: 프론트엔드, 백엔드" />
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">활동 상세</h2>
                    <p className="section-subtitle">
                      활동의 상세 내용을 입력해주세요.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>활동 목표</label>
                    <textarea
                      placeholder="활동의 목표를 자세히 작성해주세요."
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>주요 역할</label>
                    <textarea
                      placeholder="활동에서의 주요 역할을 작성해주세요."
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">성과 & 결과</h2>
                    <p className="section-subtitle">
                      활동을 통해 얻은 성과와 결과를 입력해주세요.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>주요 성과</label>
                    <textarea
                      placeholder="정량적/정성적 성과를 작성해주세요."
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>배운 점</label>
                    <textarea
                      placeholder="활동을 통해 배우고 성장한 점을 작성해주세요."
                      rows="4"
                    ></textarea>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="form-section">
                  <div className="section-intro">
                    <h2 className="section-title">자료첨부</h2>
                    <p className="section-subtitle">
                      활동 관련 자료를 첨부해주세요.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>파일 첨부</label>
                    <input type="file" multiple />
                  </div>
                  <div className="form-group">
                    <label>링크 첨부</label>
                    <input
                      type="text"
                      placeholder="관련 링크를 입력해주세요."
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 우측 미리보기 및 버튼 */}
            <div className="preview-panel">
              <div className="preview-card">
                <p className="preview-title-small">작성 미리보기</p>
                <h3 className="preview-title-large">새 활동</h3>
                <div className="preview-content">
                  <p>날짜 미정</p>
                  <p className="subtext">날짜를 입력해주세요</p>
                </div>
              </div>
              <div className="button-group">
                <button className="btn-draft">임시저장</button>
                <button className="btn-next" onClick={handleNextStep}>
                  다음
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
