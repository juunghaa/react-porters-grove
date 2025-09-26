import React, { useState, useEffect } from 'react';
import LoginForm from '../components/Auth/LoginForm';
// import { login, exchangeGoogleCode, exchangeGithubCode } from '../api';
import GoogleLoginButton from '../components/Auth/GoogleLoginButton';
// import GitHubLoginButton from '../components/Auth/GitHubLoginButton';

export default function LoginPage({ onLoginSuccess, onChangeView }) {
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // 콜백 처리를 위한 useEffect임 
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const access = qs.get("access");
    const refresh = qs.get("refresh");

    if (access && refresh) {
      // 1. 토큰 저장
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // 2. URL 정리
      window.history.replaceState({}, "", window.location.pathname);

      // 3. 상위 콜백 호출
      onLoginSuccess?.({ access, refresh });
    }
  }, [onLoginSuccess]);

  const handleLogin = async (email, password) => {
    setSubmitting(true);
    setLoginError(''); // 초기화
    try {
        const res = await login(email, password);
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        onLoginSuccess?.(res);  // 부모 컴포넌트에 성공 알림
        } catch (err) {
        console.error(err);
        if (
            err.message.includes('No active account') || 
            err.message.includes('Unable to log in')
          ) {
            setLoginError('이메일 또는 비밀번호가 올바르지 않아요');
          } else {
            setLoginError('로그인 중 오류가 발생했습니다');
          }
        } finally {
          setSubmitting(false);
        }
    };

  return (
    <>
    <LoginForm 
      onSubmit={handleLogin} 
      loginError={loginError} 
      submitting={submitting} 
      onChangeView={onChangeView}/>
   
    <GoogleLoginButton />

    </>
  );
}


// 콜백 처리는 로그인 페이지가, 버튼은 리다이렉트만, 폼은 이메일비번 제출만 담당

