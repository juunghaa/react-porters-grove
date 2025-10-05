import React, { useState } from "react";
import "./KPTpage.css";

const KPTpage = ({ onBack }) => {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];

  return (
    <div className="KPTeditor">
      <div className="frame436">
        <div className="frame432">
          <button onClick={onBack} className="cancelback-btn">
            취소
          </button>
          <div className="saving">
            <button className="tempoarysave-btn">임시저장</button>
            <button className="upload-btn">게시</button>
          </div>
        </div>

        <div className="frame439">
          <span className="kpt-label">KPT</span>

          <div className="frame440">
            <span className="title">제목</span>
            <input
              type="text"
              className="kpt-input"
              placeholder="회고 제목을 입력해주세요"
            />
          </div>
        </div>
      </div>

      <div className="frame419">
        <div className="KPTinfo">
          <div className="KPTinfo1">
            <div className="date">
              <label className="date-label">날짜</label>
              <p className="date-desc">오늘 날짜가 기본으로 선택돼요</p>
              <div className="date-input-wrapper">
                <input
                  type="date"
                  defaultValue={formattedDate}
                  className="date-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPTpage;
