// import React, { useState } from "react";
// import "./ChooseOption.css";
// import grayFlag from '../../assets/icons/flag.png';
// import blackFlag from '../../assets/icons/flag2.png';

// const ChooseOption = ({ onGoToExperience, onGoToSpec, onGoToPortfolio }) => {
//   const [expandedCard, setExpandedCard] = useState(null);
//   const [hoveredTag, setHoveredTag] = useState(null);

//   // 각 카드별 태그 옵션 (icon 제거)
//   const tagOptions = {
//     experience: [
//       { id: 'project', label: '프로젝트' },
//       { id: 'contest', label: '공모전' },
//       { id: 'campus', label: '교내활동' },
//       { id: 'external', label: '대외활동' },
//       { id: 'club', label: '동아리' },
//       { id: 'hackathon', label: '해커톤' },
//       { id: 'startup', label: '창업' },
//       { id: 'research', label: '연구' },
//       { id: 'volunteer', label: '봉사' },
//       { id: 'education', label: '교육' }
//     ],
//     spec: [
//       { id: 'certificate', label: '자격증' },
//       { id: 'award', label: '수상' },
//       { id: 'career', label: '경력' },
//       { id: 'intern', label: '인턴' },
//       { id: 'overseas', label: '해외경험' }
//     ],
//     portfolio: [
//       { id: 'resume', label: '이력서' },
//       { id: 'portfolio', label: '포트폴리오' }
//     ]
//   };

//   const handleCardClick = (cardType) => {
//     if (expandedCard === cardType) {
//       setExpandedCard(null);
//     } else {
//       setExpandedCard(cardType);
//     }
//   };

//   // 태그 클릭 시 바로 페이지 이동
//   const handleTagClick = (cardType, tagId) => {
//     if (cardType === 'experience' && onGoToExperience) {
//       onGoToExperience([tagId]);
//     } else if (cardType === 'spec' && onGoToSpec) {
//       onGoToSpec([tagId]);
//     } else if (cardType === 'portfolio' && onGoToPortfolio) {
//       onGoToPortfolio([tagId]);
//     }
//   };

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
//         <div
//           className={`option-card ${expandedCard === 'experience' ? 'expanded experience-card' : ''}`}
//           onClick={() => handleCardClick('experience')}
//         >
//           {expandedCard === 'experience' ? (
//             <div className="card-expanded-content" onClick={(e) => e.stopPropagation()}>
//               <div className="tag-container experience-tags">
//                 {tagOptions.experience.map(tag => (
//                   <button
//                     key={tag.id}
//                     className={`tag-chip ${hoveredTag === `experience-${tag.id}` ? 'hovered' : ''}`}
//                     onClick={() => handleTagClick('experience', tag.id)}
//                     onMouseEnter={() => setHoveredTag(`experience-${tag.id}`)}
//                     onMouseLeave={() => setHoveredTag(null)}
//                   >
//                     <img
//                       src={hoveredTag === `experience-${tag.id}` ? blackFlag : grayFlag}
//                       alt="flag"
//                       className="tag-icon"
//                     />
//                     <span className="tag-label">{tag.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <img
//               src="./images/Card_Experience.png"
//               alt="경험 - 프로젝트, 동아리, 공모전 등 나의 경험을 기록해요"
//             />
//           )}
//         </div>

//         {/* 스펙 카드 */}
//         <div
//           className={`option-card ${expandedCard === 'spec' ? 'expanded spec-card' : ''}`}
//           onClick={() => handleCardClick('spec')}
//         >
//           {expandedCard === 'spec' ? (
//             <div className="card-expanded-content" onClick={(e) => e.stopPropagation()}>
//               <div className="tag-container spec-tags">
//                 {tagOptions.spec.map(tag => (
//                   <button
//                     key={tag.id}
//                     className={`tag-chip ${hoveredTag === `spec-${tag.id}` ? 'hovered' : ''}`}
//                     onClick={() => handleTagClick('spec', tag.id)}
//                     onMouseEnter={() => setHoveredTag(`spec-${tag.id}`)}
//                     onMouseLeave={() => setHoveredTag(null)}
//                   >
//                     <img
//                       src={hoveredTag === `spec-${tag.id}` ? blackFlag : grayFlag}
//                       alt="flag"
//                       className="tag-icon"
//                     />
//                     <span className="tag-label">{tag.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <img
//               src="./images/Card_Spec.png"
//               alt="스펙 - 자격증, 수상, 어학 등 나의 역량을 정리해요"
//             />
//           )}
//         </div>

//         {/* 포트폴리오 카드 */}
//         <div
//           className={`option-card ${expandedCard === 'portfolio' ? 'expanded portfolio-card' : ''}`}
//           onClick={() => handleCardClick('portfolio')}
//         >
//           {expandedCard === 'portfolio' ? (
//             <div className="card-expanded-content" onClick={(e) => e.stopPropagation()}>
//               <div className="tag-container portfolio-tags">
//                 {tagOptions.portfolio.map(tag => (
//                   <button
//                     key={tag.id}
//                     className={`tag-chip ${hoveredTag === `portfolio-${tag.id}` ? 'hovered' : ''}`}
//                     onClick={() => handleTagClick('portfolio', tag.id)}
//                     onMouseEnter={() => setHoveredTag(`portfolio-${tag.id}`)}
//                     onMouseLeave={() => setHoveredTag(null)}
//                   >
//                     <img
//                       src={hoveredTag === `portfolio-${tag.id}` ? blackFlag : grayFlag}
//                       alt="flag"
//                       className="tag-icon"
//                     />
//                     <span className="tag-label">{tag.label}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <img
//               src="./images/Card_Portfolio.png"
//               alt="포트폴리오 - 내가 쌓은 경험과 스펙, 스킬을 모아 정리해요"
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChooseOption;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import "./ChooseOption.css";
import grayFlag from "../../assets/icons/flag.png";
import blackFlag from "../../assets/icons/flag2.png";

const ChooseOption = () => {
  const navigate = useNavigate(); // ✅ 추가
  const [expandedCard, setExpandedCard] = useState(null);
  const [hoveredTag, setHoveredTag] = useState(null);

  // 각 카드별 태그 옵션
  const tagOptions = {
    experience: [
      { id: "project", label: "프로젝트" },
      { id: "contest", label: "공모전" },
      { id: "campus", label: "교내활동" },
      { id: "external", label: "대외활동" },
      { id: "club", label: "동아리" },
      { id: "hackathon", label: "해커톤" },
      { id: "startup", label: "창업" },
      { id: "research", label: "연구" },
      { id: "volunteer", label: "봉사" },
      { id: "education", label: "교육" },
    ],
    spec: [
      { id: "certificate", label: "자격증" },
      { id: "award", label: "수상" },
      { id: "career", label: "경력" },
      { id: "intern", label: "인턴" },
      { id: "overseas", label: "해외경험" },
    ],
    portfolio: [
      { id: "resume", label: "이력서" },
      { id: "portfolio", label: "포트폴리오" },
    ],
  };

  // 태그 클릭 시 바로 페이지 이동
  const handleTagClick = (cardType, tagId) => {
    if (cardType === "experience" && tagId === "contest") {
      navigate("/contest", { state: { selectedTag: tagId } });
    }
  };

  return (
    <div className="choose-option">
      <div className="choose-header">
        <div className="choose-logo">
          <img src="./images/logomark.png" alt="로고" />
        </div>
        <h1 className="choose-title">무엇을 정리할까요?</h1>
        <p className="choose-subtitle">
          지금까지의 활동을 정리해 기록으로 남겨요
        </p>
      </div>

      <div className="option-container">
        {/* 경험 카드 */}
        <div
          className={`option-card ${
            expandedCard === "experience" ? "expanded experience-card" : ""
          }`}
          onMouseEnter={() => setExpandedCard("experience")}
          onMouseLeave={() => setExpandedCard(null)}
        >
          {expandedCard === "experience" ? (
            <div className="card-expanded-content">
              <div className="tag-container experience-tags">
                {tagOptions.experience.map((tag) => (
                  <button
                    key={tag.id}
                    className={`tag-chip ${
                      hoveredTag === `experience-${tag.id}` ? "hovered" : ""
                    }`}
                    onClick={() => handleTagClick("experience", tag.id)}
                    onMouseEnter={() => setHoveredTag(`experience-${tag.id}`)}
                    onMouseLeave={() => setHoveredTag(null)}
                  >
                    <img
                      src={
                        hoveredTag === `experience-${tag.id}`
                          ? blackFlag
                          : grayFlag
                      }
                      alt="flag"
                      className="tag-icon"
                    />
                    <span className="tag-label">{tag.label}</span>
                  </button>
                ))}
              </div>
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
          className={`option-card ${
            expandedCard === "spec" ? "expanded spec-card" : ""
          }`}
          onMouseEnter={() => setExpandedCard("spec")}
          onMouseLeave={() => setExpandedCard(null)}
        >
          {expandedCard === "spec" ? (
            <div className="card-expanded-content">
              <div className="tag-container spec-tags">
                {tagOptions.spec.map((tag) => (
                  <button
                    key={tag.id}
                    className={`tag-chip ${
                      hoveredTag === `spec-${tag.id}` ? "hovered" : ""
                    }`}
                    onClick={() => handleTagClick("spec", tag.id)}
                    onMouseEnter={() => setHoveredTag(`spec-${tag.id}`)}
                    onMouseLeave={() => setHoveredTag(null)}
                  >
                    <img
                      src={
                        hoveredTag === `spec-${tag.id}` ? blackFlag : grayFlag
                      }
                      alt="flag"
                      className="tag-icon"
                    />
                    <span className="tag-label">{tag.label}</span>
                  </button>
                ))}
              </div>
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
          className={`option-card ${
            expandedCard === "portfolio" ? "expanded portfolio-card" : ""
          }`}
          onMouseEnter={() => setExpandedCard("portfolio")}
          onMouseLeave={() => setExpandedCard(null)}
        >
          {expandedCard === "portfolio" ? (
            <div className="card-expanded-content">
              <div className="tag-container portfolio-tags">
                {tagOptions.portfolio.map((tag) => (
                  <button
                    key={tag.id}
                    className={`tag-chip ${
                      hoveredTag === `portfolio-${tag.id}` ? "hovered" : ""
                    }`}
                    onClick={() => handleTagClick("portfolio", tag.id)}
                    onMouseEnter={() => setHoveredTag(`portfolio-${tag.id}`)}
                    onMouseLeave={() => setHoveredTag(null)}
                  >
                    <img
                      src={
                        hoveredTag === `portfolio-${tag.id}`
                          ? blackFlag
                          : grayFlag
                      }
                      alt="flag"
                      className="tag-icon"
                    />
                    <span className="tag-label">{tag.label}</span>
                  </button>
                ))}
              </div>
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
