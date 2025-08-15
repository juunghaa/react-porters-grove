import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { googleLogin } from '../api'; // 백엔드 POST 요청 보내는 함수


export default function OAuthCallback() {
    const navigate = useNavigate();
    
    useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const fetchToken = async () => {
      try {
        const res = await googleLogin(code);  // 백엔드에 code 전달
        localStorage.setItem('access', res.access);
        localStorage.setItem('refresh', res.refresh);
        navigate('/');  // 로그인 후 홈으로 이동
      } catch (error) {
        console.error('OAuth 처리 실패:', error);
      }
    };

    if (code) {
      fetchToken();
    }
  }, [navigate]);

  return <p>로그인 처리 중입니다...</p>;
}
