// import React, { useState } from "react";
// import "./ChooseOption.css";
// import ReviewPopup from "./ReviewPopup";

// // const ChooseOption = ({ onGoToActivity }) => {
// //   const [isPopupOpen, setIsPopupOpen] = useState(false);

// //   const openPopup = () => {
// //     setIsPopupOpen(true);
// //   };

// //   const closePopup = () => {
// //     setIsPopupOpen(false);
// //   };

// //   return (
// //     <div className="choose-option">
// //       <div className="option-container">
// //         <div className="option-card" id="retrospective" onClick={openPopup}>
// //           <h2 className="option-title">회고 작성하기</h2>
// //           <p className="option-description">
// //             지난 활동을 돌아보고 나만의 회고를 작성하세요.
// //           </p>
// //         </div>
// //         <div className="option-card" id="activity-log" onClick={onGoToActivity}>
// //           <h2 className="option-title">활동 기록하기</h2>
// //           <p className="option-description">
// //             스터디, 사이드 프로젝트 등 활동 내역을 기록하고 관리해보세요.
// //           </p>
// //         </div>
// //       </div>
// //       {isPopupOpen && <ReviewPopup onClose={closePopup} />}{" "}
// //       {/* isPopupOpen이 켜져있을때만 팝업창 나타남. 닫을때는 closePopuup사용함 */}
// //       {/* isPopupOpen이 켜져있을때만 팝업창 나타남*/}
// //     </div>
// //   );
// // };
// const ChooseOption = ({ onGoToExperience, onGoToSpec, onGoToPortfolio }) => {
//   return (
//     <div className="choose-option">
//       <div className="choose-header">
//         <div className="choose-logo">
//           <img src="./images/logomark.png" alt="로고" />
//         </div>
//         <h1 className="choose-title">무엇을 정리할까요?</h1>
//         <p className="choose-subtitle">지금까지의 활동을 정리해 기록으로 남겨요</p>
//       </div>

//       <div className="option-container">
//         {/* 경험 카드 */}
//         <div className="option-card" onClick={onGoToExperience}>
//           <img 
//             src="./images/Card_Experience.png" 
//             alt="경험 - 프로젝트, 동아리, 공모전 등 나의 경험을 기록해요" 
//           />
//         </div>

//         {/* 스펙 카드 */}
//         <div className="option-card" onClick={onGoToSpec}>
//           <img 
//             src="./images/Card_Spec.png" 
//             alt="스펙 - 자격증, 수상, 어학 등 나의 역량을 정리해요" 
//           />
//         </div>

//         {/* 포트폴리오 카드 */}
//         <div className="option-card" onClick={onGoToPortfolio}>
//           <img 
//             src="./images/Card_Portfolio.png" 
//             alt="포트폴리오 - 내가 쌓은 경험과 스펙, 스킬을 모아 정리해요" 
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChooseOption;



import React, { useState } from "react";
import "./ChooseOption.css";

const ChooseOption = ({ onGoToExperience, onGoToSpec, onGoToPortfolio }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedTags, setSelectedTags] = useState({
    experience: [],
    spec: [],
    portfolio: []
  });

  // 각 카드별 태그 옵션
  const tagOptions = {
    experience: [
      { id: 'project', label: '프로젝트', icon: '🚀' },
      { id: 'contest', label: '공모전', icon: '🏆' },
      { id: 'campus', label: '교내활동', icon: '🎓' },
      { id: 'external', label: '대외활동', icon: '🌍' },
      { id: 'club', label: '동아리', icon: '👥' },
      { id: 'hackathon', label: '해커톤', icon: '💻' },
      { id: 'startup', label: '창업', icon: '💡' },
      { id: 'research', label: '연구', icon: '🔬' },
      { id: 'volunteer', label: '봉사', icon: '🤝' }
    ],
    spec: [
      { id: 'certificate', label: '자격증', icon: '📜' },
      { id: 'award', label: '수상', icon: '🏅' },
      { id: 'language', label: '어학', icon: '🗣️' },
      { id: 'exam', label: '시험', icon: '📝' }
    ],
    portfolio: [
      { id: 'all', label: '전체', icon: '📋' },
      { id: 'design', label: '디자인', icon: '🎨' },
      { id: 'development', label: '개발', icon: '⚙️' },
      { id: 'planning', label: '기획', icon: '📊' }
    ]
  };

  const handleCardClick = (cardType) => {
    if (expandedCard === cardType) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardType);
    }
  };

  const handleTagSelect = (cardType, tagId) => {
    setSelectedTags(prev => {
      const currentTags = prev[cardType];
      if (currentTags.includes(tagId)) {
        return {
          ...prev,
          [cardType]: currentTags.filter(id => id !== tagId)
        };
      } else {
        return {
          ...prev,
          [cardType]: [...currentTags, tagId]
        };
      }
    });
  };

  const handleConfirm = (cardType) => {
    // 선택 완료 후 해당 페이지로 이동
    if (cardType === 'experience' && onGoToExperience) {
      onGoToExperience(selectedTags.experience);
    } else if (cardType === 'spec' && onGoToSpec) {
      onGoToSpec(selectedTags.spec);
    } else if (cardType === 'portfolio' && onGoToPortfolio) {
      onGoToPortfolio(selectedTags.portfolio);
    }
  };

  return (
    <div className="choose-option">
      <div className="choose-header">
        <div className="choose-logo">
          <img src="./images/logomark.png" alt="로고" />
        </div>
        <h1 className="choose-title">무엇을 정리할까요?</h1>
        <p className="choose-subtitle">지금까지의 활동을 정리해 기록으로 남겨요</p>
      </div>

      <div className="option-container">
        {/* 경험 카드 */}
        <div 
          className={`option-card ${expandedCard === 'experience' ? 'expanded' : ''}`}
          onClick={() => handleCardClick('experience')}
        >
          {expandedCard === 'experience' ? (
            <div className="card-expanded-content" onClick={(e) => e.stopPropagation()}>
              <div className="card-header">
              </div>
              <div className="tag-container">
                {tagOptions.experience.map(tag => (
                  <button
                    key={tag.id}
                    className={`tag-chip ${selectedTags.experience.includes(tag.id) ? 'selected' : ''}`}
                    onClick={() => handleTagSelect('experience', tag.id)}
                  >
                    <span className="tag-icon">{tag.icon}</span>
                    <span className="tag-label">{tag.label}</span>
                  </button>
                ))}
              </div>
              <button 
                className="confirm-button"
                onClick={() => handleConfirm('experience')}
              >
                선택 완료
              </button>
            </div>
          ) : (
            <img 
              src="./images/Card_Experience.png" 
              alt="경험 - 프로젝트, 동아리, 공모전 등 나의 경험을 기록해요" 
            />
          )}
        </div>

        {/* 스펙 카드 */}
        <div 
          className={`option-card ${expandedCard === 'spec' ? 'expanded' : ''}`}
          onClick={() => handleCardClick('spec')}
        >
          {expandedCard === 'spec' ? (
            <div className="card-expanded-content" onClick={(e) => e.stopPropagation()}>
              <div className="card-header">
              </div>
              <div className="tag-container">
                {tagOptions.spec.map(tag => (
                  <button
                    key={tag.id}
                    className={`tag-chip ${selectedTags.spec.includes(tag.id) ? 'selected' : ''}`}
                    onClick={() => handleTagSelect('spec', tag.id)}
                  >
                    <span className="tag-icon">{tag.icon}</span>
                    <span className="tag-label">{tag.label}</span>
                  </button>
                ))}
              </div>
              <button 
                className="confirm-button"
                onClick={() => handleConfirm('spec')}
              >
                선택 완료
              </button>
            </div>
          ) : (
            <img 
              src="./images/Card_Spec.png" 
              alt="스펙 - 자격증, 수상, 어학 등 나의 역량을 정리해요" 
            />
          )}
        </div>

        {/* 포트폴리오 카드 */}
        <div 
          className={`option-card ${expandedCard === 'portfolio' ? 'expanded' : ''}`}
          onClick={() => handleCardClick('portfolio')}
        >
          {expandedCard === 'portfolio' ? (
            <div className="card-expanded-content" onClick={(e) => e.stopPropagation()}>
              <div className="card-header">
              </div>
              <div className="tag-container">
                {tagOptions.portfolio.map(tag => (
                  <button
                    key={tag.id}
                    className={`tag-chip ${selectedTags.portfolio.includes(tag.id) ? 'selected' : ''}`}
                    onClick={() => handleTagSelect('portfolio', tag.id)}
                  >
                    <span className="tag-icon">{tag.icon}</span>
                    <span className="tag-label">{tag.label}</span>
                  </button>
                ))}
              </div>
              <button 
                className="confirm-button"
                onClick={() => handleConfirm('portfolio')}
              >
                선택 완료
              </button>
            </div>
          ) : (
            <img 
              src="./images/Card_Portfolio.png" 
              alt="포트폴리오 - 내가 쌓은 경험과 스펙, 스킬을 모아 정리해요" 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChooseOption;