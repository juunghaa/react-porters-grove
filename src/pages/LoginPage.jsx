import React, { useState, useEffect } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { login, exchangeGoogleCode, exchangeGithubCode } from '../api';
import GoogleLoginButton from '../components/Auth/GoogleLoginButton';
import GitHubLoginButton from '../components/Auth/GitHubLoginButton';

export default function LoginPage({ onLoginSuccess }) {
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const GOOGLE_REDIRECT = process.env.REACT_APP_GOOGLE_REDIRECT;
  const GITHUB_REDIRECT = process.env.REACT_APP_GITHUB_REDIRECT;
 
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const provider = qs.get('provider'); // 'google' | 'github'
    const code = qs.get('code');
    if (!provider || !code) return;

    const redirectUri = provider === 'google' ? GOOGLE_REDIRECT : GITHUB_REDIRECT;
    // exchangeGoogleCode(code, redirectUri) or exchangeGithubCode(code, redirectUri)
  }, []);

  //소셜 콜백 처리
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const provider = qs.get('provider'); // 'google' | 'github'
    const code = qs.get('code');
    const state = qs.get('state');
    if (!provider || !code) return;

    (async () => {
      setSubmitting(true);
      setLoginError('');
      try {
        const saved = sessionStorage.getItem(`oauth_state_${provider}`);
        if (!state || saved !== state) throw new Error('유효하지 않은 로그인 요청입니다.');

        const redirectUri = `${window.location.origin}/auth/${provider}/login/`;
        const data = provider === 'google'
          ? await exchangeGoogleCode(code, redirectUri)
          : await exchangeGithubCode(code, redirectUri);

        localStorage.setItem('access', data.access);
        localStorage.setItem('refresh', data.refresh);
        sessionStorage.removeItem(`oauth_state_${provider}`);
        window.history.replaceState({}, '', window.location.pathname);
        onLoginSuccess?.(data);
      } catch (e) {
        setLoginError(e.message || '소셜 로그인 실패');
      } finally {
        setSubmitting(false);
      }
    })();
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
    <LoginForm onSubmit={handleLogin} loginError={loginError} submitting={submitting} />
    <GoogleLoginButton redirectUri={GOOGLE_REDIRECT} />
    <GitHubLoginButton redirectUri={GITHUB_REDIRECT} />
    </>
  );
}


// 콜백 처리는 로그인 페이지가, 버튼은 리다이렉트만, 폼은 이메일비번 제출만 담당

