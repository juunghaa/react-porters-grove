import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  return (
    <div className="project-card">
      {/* 태그들 */}
      <div className="project-tags">
        {project.tags.map((tag, index) => (
          <span
            key={index}
            className="project-tag"
            style={{
              backgroundColor: tag.color || '#f3f4f6',
              color: tag.textColor || '#374151'
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* 제목 */}
      <h3 className="project-title">
        {project.title}
      </h3>

      {/* 날짜 */}
      <div className="project-date">
        <span>📅</span>
        <span>{project.dateRange}</span>
      </div>

      {/* 설명 */}
      <p className="project-description">
        {project.description}
      </p>
    </div>
  );
};

export default ProjectCard;