import React, { useState } from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { login } from '../api';

export default function LoginPage({ onLoginSuccess }) {
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
    <LoginForm onSubmit={handleLogin} loginError={loginError} submitting={submitting} />
  );
}




