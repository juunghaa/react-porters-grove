import React from 'react';
import './EmptyBox.css';

const EmptyBox = ({ 
  isPanelCollapsed,
  config,
  onAdd,
  onMenuClick
}) => {
  if (!config) return null;

  return (
    <div className={`box-status ${isPanelCollapsed ? 'expanded' : ''}`}>
      <div className="box-content">
        {/* 헤더 */}
        <div className="empty-box-header">
          <div className="empty-box-title">
            {/* 이미지 아이콘으로 변경 */}
            <img src={config.titleIcon} alt="icon" className="empty-box-title-icon" />
            <h3>{config.title}</h3>
            <span className="empty-box-count">{config.count}</span>
          </div>
          <div className="empty-box-actions">
            <button className="empty-box-menu-btn" onClick={onMenuClick}>
              <span>⋯</span>
            </button>
            <button className="empty-box-add-btn" onClick={onAdd}>
              <span style={{fontSize: "24px", paddingRight: "6px"}}>+</span>
            </button>
          </div>
        </div>

        {/* 빈 상태 영역 */}
        <div className="empty-box-content">
          <img src={config.emptyIcon} alt="empty" className="empty-box-image" />
          <p className="empty-box-main-text">{config.emptyText}</p>
          <p className="empty-box-sub-text">{config.subText}</p>
        </div>

        {/* 하단 추가 버튼 */}
        <button className="empty-box-add-button" onClick={onAdd}>
          <span style={{fontSize: "24px", paddingLeft: "6px", paddingTop:"1.5px"}}>+</span>
          {config.buttonText}
        </button>
      </div>
    </div>
  );
};

export default EmptyBox;