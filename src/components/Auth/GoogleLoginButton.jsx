import React from 'react';
import { googleLogin } from '../../api';

const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // <-- 구글 콘솔에서 발급받은 client_id
const REDIRECT_URI = 'http://localhost:3000/oauth/callback'; // 프론트엔드 콜백 주소 (배포 시 변경)
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=email profile`;

export default function GoogleLoginButton({ onLoginSuccess }) {
  const handleGoogleLogin = async () => {
    // try {
      window.location.href = GOOGLE_AUTH_URL;

      // const result = await signInWithPopup(auth, provider);
      // const token = await result.user.getIdToken();

      // const credential = provider.credentialFromResult(result);
      // const accessToken = credential?.accessToken;
    //   if(!accessToken) {
    //     throw new Error('Google access token이 없습니다.');
    //   }

    //   const res = await googleLogin(accessToken);
    //   localStorage.setItem('access', res.access);
    //   localStorage.setItem('refresh', res.refresh);
    //   console.log('구글 로그인 성공:', result.user);
    //   onLoginSuccess();  // 로그인 성공시 상태 업데이트
    // } catch (error) {
    //   console.error('구글 로그인 실패:', error);
    // }
  };

  return (
    <button onClick={handleGoogleLogin} className="google-login-button">
      <img src="/google-icon.svg" alt="Google logo image" width="20" height="20" />
      Google로 로그인
    </button>
  );
}
