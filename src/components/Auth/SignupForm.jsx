import React, { useState } from 'react';
import { register } from '../../api'; // ← api 파일 경로 맞춰주세요

const TERMS_TITLE = {
    tos: '서비스 이용약관',
    privacy: '개인정보 처리방침',
    copyright: '저작권 및 콘텐츠 이용 동의',
    select: '마케팅 정보 수신 동의',
  };

const TERMS_TEXT = {
  tos: `**제1조 (목적)**

본 약관은 PORTME(이하 "회사")가 제공하는 포트폴리오 제작·관리 플랫폼 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.

**제2조 (정의)**

1. "서비스"라 함은 회사가 제공하는 웹·앱 기반 포트폴리오 제작, 활동 기록, 자료 관리, 커뮤니티 기능 등을 말합니다.
2. "회원"이라 함은 본 약관에 동의하고 서비스를 이용하는 자를 말합니다.
3. "콘텐츠"라 함은 회원이 서비스에 등록·작성·업로드하는 모든 자료(문서, 이미지, 영상 등)를 말합니다.

**제3조 (약관의 효력 및 변경)**

1. 본 약관은 회원이 동의함으로써 효력이 발생합니다.
2. 회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 변경 시 서비스 내 공지 또는 이메일로 사전 공지합니다.
3. 변경된 약관에 동의하지 않을 경우 회원은 이용계약을 해지할 수 있습니다.

**제4조 (서비스의 제공 및 변경)**

1. 회사는 회원에게 다음과 같은 서비스를 제공합니다.
    
    ① 포트폴리오 및 활동 기록 관리 기능
    
    ② 커뮤니티(아티클·Q&A) 기능
    
    ③ 대학·기관과의 피드백 연계 기능
    
2. 회사는 서비스 내용 및 제공 방식을 변경할 수 있으며, 중요한 변경 시 사전 공지합니다.

**제5조 (회원의 의무)**

1. 회원은 다음 행위를 해서는 안 됩니다.
    
    ① 타인의 계정 또는 정보를 도용하는 행위
    
    ② 허위 또는 과장된 정보 기재
    
    ③ 저작권 등 제3자의 권리를 침해하는 행위
    
    ④ 법령에 위반되는 콘텐츠 업로드
    
2. 회원은 자신의 계정과 비밀번호를 안전하게 관리할 책임이 있습니다.

**제6조 (지적재산권)**

1. 서비스 및 회사가 제작한 콘텐츠의 저작권은 회사에 귀속됩니다.
2. 회원이 작성한 콘텐츠의 저작권은 해당 회원에게 있으며, 회사는 서비스 운영·홍보를 위한 범위 내에서 비독점적 사용권을 가집니다.

**제7조 (면책조항)**

회사는 천재지변, 불가항력, 회원의 귀책사유로 인한 서비스 이용 장애에 대해 책임을 지지 않습니다.`,
  privacy: `**1. 수집하는 개인정보 항목**

- 필수: 이름, 이메일, 비밀번호, 학년/전공, 활동 기록 데이터
- 선택: 연락처, 프로필 이미지, SNS 계정

**2. 수집 및 이용 목적**

- 회원 가입 및 본인 확인
- 서비스 제공 및 이용 기록 관리
- 고객 문의 응대 및 서비스 개선
- 맞춤형 서비스 제공

**3. 보유 및 이용 기간**

- 회원 탈퇴 시 즉시 파기
- 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관

**4. 개인정보 제3자 제공**

- 원칙적으로 동의 없이 제3자에게 제공하지 않음
- 대학·기관 피드백 기능 이용 시, 회원 동의 후 해당 기관에 제공

**5. 개인정보 처리 위탁**

- 서비스 운영을 위해 필요한 경우 위탁업체와 계약을 체결하고 관련 내용을 공지

**6. 이용자의 권리**

- 본인 정보 열람, 정정, 삭제, 처리정지 요청 가능

**7. 개인정보 보호책임자**

- Poters
- 이메일: porters.official@gmail.com`,
  copyright: `1. 회원이 작성·업로드한 모든 콘텐츠의 저작권은 원칙적으로 해당 회원에게 귀속됩니다.
2. 회원은 회사가 서비스 운영 및 홍보를 위해 비상업적 목적으로 해당 콘텐츠를 활용하는 것에 동의합니다.
3. 회원은 자신이 업로드하는 콘텐츠가 제3자의 권리를 침해하지 않음을 보증합니다.`,
  select: `1. 회사는 이메일, 문자, 앱 푸시 등을 통해 이벤트·신규 기능·소식 등을 안내할 수 있습니다.
2. 회원은 언제든 수신 동의를 철회할 수 있습니다.`,
};

export default function SignupForm({ onSignupSuccess, onChangeView }) {
  const [email, setEmail] = useState('');
  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [name, setName] = useState('');

  // 필수 약관 3종을 각각 관리
  const [agreeTos, setAgreeTos] = useState(false);        // 서비스 이용약관
  const [agreePrivacy, setAgreePrivacy] = useState(false); // 개인정보 처리방침
  const [agreeCopyright, setAgreeCopyright] = useState(false); // 저작권 동의
  const [agreeMarketing, setAgreeMarketing] = useState(false); // 선택

  const [termsOpen, setTermsOpen] = useState(null);

  // 에러/상태
  const [emailError, setEmailError] = useState('');
  const [pw1Error, setPw1Error] = useState('');
  const [pw2Error, setPw2Error] = useState('');
  const [nameError, setNameError] = useState('');
  const [agreeError, setAgreeError] = useState('');
  const [signupError, setSignupError] = useState('');
  const [submitState, setSubmitState] = useState('idle');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 에러 초기화
    setEmailError(''); setPw1Error(''); setPw2Error(''); setNameError('');
    setAgreeError(''); setSignupError('');

    // 클라이언트 유효성
    let valid = true;
    if (!email || !email.includes('@')) { setEmailError('올바른 이메일을 입력해주세요.'); valid = false; }
    if (!pw1 || pw1.length < 8) { setPw1Error('비밀번호는 8자 이상이어야 합니다.'); valid = false; }
    if (pw1 !== pw2) { setPw2Error('비밀번호 확인이 일치하지 않습니다.'); valid = false; }
    if (!name.trim()) { setNameError('이름을 입력해주세요.'); valid = false; }
    if (!(agreeTos && agreePrivacy && agreeCopyright)) {
      setAgreeError('필수 약관에 모두 동의해주세요.'); valid = false;
    }
    if (!valid) return;

    try {
      setSubmitState('loading');

      // ✅ 회원가입 API 호출 - 명세서에 맞게 파라미터 전달
      const data = await register(email, pw1, pw2, name);
      
      // ✅ 토큰 저장 (명세서 응답: { access, refresh, user })
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);
      
      // ✅ user 정보도 저장 (선택사항)
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      setSubmitState('success');
      setSignupSuccess('회원가입에 성공하였습니다! 🎉');
      
      // ✅ 부모에게 성공 알림 (데이터 전달)
      onSignupSuccess?.(data);

    } catch (err) {
      setSubmitState('error');
      setSignupError(err.message || '회원가입 실패');
    }
  };

  const agreeFromModal = () => {
    if (termsOpen === 'tos') setAgreeTos(true);
    if (termsOpen === 'privacy') setAgreePrivacy(true);
    if (termsOpen === 'copyright') setAgreeCopyright(true);
    if (termsOpen === 'select') setAgreeMarketing(true);
    setTermsOpen(null);
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="sign-form">
    
      {signupSuccess && <div className="login-alert">{signupSuccess}</div>}

      <h2 className="login-title">나를 보여주는 포트폴리오, 지금부터 시작해볼까요?</h2>
      <p className="login-subtitle">당신의 경험을 더 많은 사람에게<br/>정확하게, 멋지게 전달할 수 있어요</p>

      <div className="input-group">
        <label htmlFor="signup-email">이메일 주소</label>
        <input
          type="text" id="signup-email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          className={emailError ? 'input-error' : ''}
          disabled={submitState === 'loading'}
        />
        {emailError && <p className="error-text">{emailError}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="signup-pw1">비밀번호</label>
        <input
          type="password" id="signup-pw1"
          value={pw1} onChange={(e) => setPw1(e.target.value)}
          className={pw1Error ? 'input-error' : ''}
          disabled={submitState === 'loading'}
        />
        {pw1Error && <p className="error-text">{pw1Error}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="signup-pw2">비밀번호 확인</label>
        <input
          type="password" id="signup-pw2"
          value={pw2} onChange={(e) => setPw2(e.target.value)}
          className={pw2Error ? 'input-error' : ''}
          disabled={submitState === 'loading'}
        />
        {pw2Error && <p className="error-text">{pw2Error}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="signup-name">이름</label>
        <input
          type="text" id="signup-name"
          value={name} onChange={(e) => setName(e.target.value)}
          className={nameError ? 'input-error' : ''}
          disabled={submitState === 'loading'}
        />
        {nameError && <p className="error-text">{nameError}</p>}
      </div>

      {/* 필수 약관 3종 */}
      <div className="input-group checkbox-tight">
        <label className="checkbox-label">
          <input type="checkbox" checked={agreeTos} onChange={(e) => setAgreeTos(e.target.checked)} />
          <span className="checkbox-text"> [필수] 서비스 이용약관</span>
          <button type="button" className="link-button" onClick={() => setTermsOpen('tos')}>더보기</button>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} />
          <span className="checkbox-text"> [필수] 개인정보 처리방침</span>
          <button type="button" className="link-button" onClick={() => setTermsOpen('privacy')}>더보기</button>
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={agreeCopyright} onChange={(e) => setAgreeCopyright(e.target.checked)} />
          <span className="checkbox-text"> [필수] 저작권 및 콘텐츠 이용 동의</span>
          <button type="button" className="link-button" onClick={() => setTermsOpen('copyright')}>더보기</button>
        </label>
        {agreeError && <p className="error-text">{agreeError}</p>}
      </div>

      {/* 선택 동의 */}
      <div className="input-group checkbox-tight">
        <label className="checkbox-label">
          <input type="checkbox" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} />
          <span className="checkbox-text"> [선택] 마케팅 정보 수신 동의</span>
          <button type="button" className="link-button" onClick={() => setTermsOpen('select')}>더보기</button>
        </label>
      </div>

      {signupError && <p className="error-text">{signupError}</p>}

      <button type="submit" className="submit-button-big" disabled={submitState === 'loading'}>
        {submitState === 'loading' ? '가입 중…' : '가입하기'}
      </button>

      <div className="login-options">
        <span className="divider-vertical"></span>
        <a href="#" onClick={() => onChangeView?.("login")}>로그인 하러가기</a>
        <span className="divider-vertical"></span>
      </div>
    </form>

    {termsOpen && (
        <div className="modal-backdrop">
        <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-title"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="modal-header">
            <h3 id="terms-title">{TERMS_TITLE[termsOpen]}</h3>
            </div>
            <div className="modal-body">
            <pre className="terms-text">{TERMS_TEXT[termsOpen]}</pre>
            </div>
            <div className="modal-actions">
            <button className="btn" onClick={() => setTermsOpen(null)}>닫기</button>
            <button className="btn primary" onClick={agreeFromModal}>동의합니다</button>
            </div>
        </div>
        </div>
    )}
    </>
  );
}