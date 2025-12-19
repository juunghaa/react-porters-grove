import React, { useState, useEffect } from 'react';
import SpecCard from './SpecCard';
import './SpecTabContent.css';

// API 함수들
const fetchCareers = async () => {
  const access = localStorage.getItem('access');
  const response = await fetch('/api/careers/', {
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('경력 조회 실패');
  const data = await response.json();
  return data.results || data || [];
};

const fetchAwards = async () => {
  const access = localStorage.getItem('access');
  const response = await fetch('/api/awards/', {
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('수상 조회 실패');
  const data = await response.json();
  return data.results || data || [];
};

const fetchCertifications = async () => {
  const access = localStorage.getItem('access');
  const response = await fetch('/api/certifications/', {
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('자격증 조회 실패');
  const data = await response.json();
  return data.results || data || [];
};

const fetchGlobalExps = async () => {
  const access = localStorage.getItem('access');
  const response = await fetch('/api/globalexps/', {
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('해외경험 조회 실패');
  const data = await response.json();
  return data.results || data || [];
};

const fetchForeignLangs = async () => {
  const access = localStorage.getItem('access');
  const response = await fetch('/api/foreignlangs/', {
    headers: {
      'Authorization': `Bearer ${access}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('외국어 조회 실패');
  const data = await response.json();
  return data.results || data || [];
};

const SpecTabContent = ({ onGoToChooseOption }) => {
  const [specs, setSpecs] = useState({
    careers: [],
    awards: [],
    certifications: [],
    globalexps: [],
    foreignlangs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllSpecs = async () => {
      try {
        const [careers, awards, certifications, globalexps, foreignlangs] = await Promise.all([
          fetchCareers().catch(() => []),
          fetchAwards().catch(() => []),
          fetchCertifications().catch(() => []),
          fetchGlobalExps().catch(() => []),
          fetchForeignLangs().catch(() => [])
        ]);

        setSpecs({
          careers,
          awards,
          certifications,
          globalexps,
          foreignlangs
        });
      } catch (error) {
        console.error('스펙 로딩 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllSpecs();
  }, []);

  // 모든 스펙을 하나의 배열로 합치기
  const getAllSpecs = () => {
    const allSpecs = [];
    
    specs.careers.forEach(item => allSpecs.push({ ...item, type: 'career' }));
    specs.awards.forEach(item => allSpecs.push({ ...item, type: 'award' }));
    specs.certifications.forEach(item => allSpecs.push({ ...item, type: 'certification' }));
    specs.globalexps.forEach(item => allSpecs.push({ ...item, type: 'globalexp' }));
    specs.foreignlangs.forEach(item => allSpecs.push({ ...item, type: 'foreignlang' }));

    return allSpecs;
  };

  const allSpecs = getAllSpecs();
  const hasSpecs = allSpecs.length > 0;

  if (loading) {
    return (
      <div className="spec-tab-container">
        <div className="spec-loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="spec-tab-container">
      {hasSpecs ? (
        <div className="spec-cards-grid">
          {allSpecs.map((spec, index) => (
            <SpecCard 
              key={`${spec.type}-${spec.id || index}`} 
              spec={spec} 
              type={spec.type} 
            />
          ))}
        </div>
      ) : (
        <div className="spec-empty">
          <div className="spec-empty-content">
            <p className="spec-empty-text">아직 정리된 스펙이 없어요</p>
            <p className="spec-empty-subtext">지금 바로 내 역량을 기록해보세요</p>
            <button className="spec-add-btn" onClick={onGoToChooseOption}>
              + 스펙 추가하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecTabContent;