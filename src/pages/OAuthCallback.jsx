// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { exchangeGoogleCode, exchangeGithubCode } from '../api';

// export default function OAuthCallback() {
//   const nav = useNavigate();
//   const provider = window.location.pathname.includes('/oauth/github') ? 'github' : 'google';

//   useEffect(() => {
//     (async () => {
//       const params = new URLSearchParams(window.location.search);
//       const code = params.get('code');
//       const state = params.get('state');

//       // state 검증(권장)
//       const key = provider === 'github' ? 'oauth_state_github' : 'oauth_state_google';
//       const expect = sessionStorage.getItem(key);
//       sessionStorage.removeItem(key);
//       if (expect && state && expect !== state) throw new Error('잘못된 요청입니다');

//       if (!code) throw new Error('code가 없습니다');

//       const redirectUri = `${window.location.origin}/oauth/${provider}`;
//       const exch = provider === 'github' ? exchangeGithubCode : exchangeGoogleCode;
//       const data = await exch(code, redirectUri); // { access, refresh, user }

//       localStorage.setItem('access', data.access);
//       localStorage.setItem('refresh', data.refresh);
//       // localStorage.setItem('user', JSON.stringify(data.user)); // 원하면

//       window.location.replace('/');
//     })().catch(err => {
//       console.error(err);
//       alert(`소셜 로그인 실패: ${err.message}`);
//       nav('/login');
//     });
//   }, [nav, provider]);

//   return <div>소셜 로그인 처리 중…</div>;
// }


// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { exchangeGoogleCode, exchangeGithubCode } from '../api';

// export default function OAuthCallback() {
//   const nav = useNavigate();
//   const provider = window.location.pathname.includes('/oauth/github') ? 'github' : 'google';

//   useEffect(() => {
//     (async () => {
//       const params = new URLSearchParams(window.location.search);
//       const code = params.get('code');
//       const state = params.get('state');

//       // state 검증 (프론트 보안용)
//       const key = provider === 'github' ? 'oauth_state_github' : 'oauth_state_google';
//       const expect = sessionStorage.getItem(key);
//       sessionStorage.removeItem(key);
//       if (expect && state && expect !== state) {
//         throw new Error('잘못된 요청입니다 (state 불일치)');
//       }

//       if (!code) throw new Error('code가 없습니다');

//       // ✅ code + state 전달
//       const exch = provider === 'github' ? exchangeGithubCode : exchangeGoogleCode;
//       const data = await exch(code, state); // 여기서 redirectUri 대신 state 넘김

//       // 토큰 저장
//       localStorage.setItem('access', data.access);
//       localStorage.setItem('refresh', data.refresh);
//       if (data.user) {
//         localStorage.setItem('user', JSON.stringify(data.user));
//       }

//       // 홈으로 리다이렉트
//       window.location.replace('/');
//     })().catch(err => {
//       console.error(err);
//       alert(`소셜 로그인 실패: ${err.message}`);
//       nav('/login');
//     });
//   }, [nav, provider]);

//   return <div>소셜 로그인 처리 중…</div>;
// }






// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { exchangeGoogleCode, exchangeGithubCode } from '../api';

// export default function OAuthCallback() {
//   const nav = useNavigate();
//   const provider = window.location.pathname.includes('/oauth/github')
//     ? 'github'
//     : 'google';

//   useEffect(() => {
//     (async () => {
//       const params = new URLSearchParams(window.location.search);
//       const code = params.get('code');
//       const state = params.get('state');

//       if (!code) throw new Error('code가 없습니다');

//       // ✅ code + state를 그대로 백엔드로 전달
//       const exch = provider === 'github' ? exchangeGithubCode : exchangeGoogleCode;
//       const data = await exch(code, state); // { access, refresh, user }

//       // 토큰 저장
//       localStorage.setItem('access', data.access);
//       localStorage.setItem('refresh', data.refresh);
//       if (data.user) {
//         localStorage.setItem('user', JSON.stringify(data.user));
//       }

//       // 홈으로 이동
//       window.location.replace('/');
//     })().catch(err => {
//       console.error(err);
//       alert(`소셜 로그인 실패: ${err.message}`);
//       nav('/login');
//     });
//   }, [nav, provider]);

//   return <div>소셜 로그인 처리 중…</div>;
// }


// AuthCallback.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function OAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) {
      alert("구글 로그인 실패: code 없음");
      return;
    }

    // ✅ 백엔드에 code + state 전달
    fetch("/api/auth/google/callback/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.tokens?.access) {
          localStorage.setItem("access", data.tokens.access);
          localStorage.setItem("refresh", data.tokens.refresh);
          alert("로그인 성공!");
          navigate("/"); // 홈으로 이동
        } else {
          alert("로그인 실패: " + JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.error("로그인 오류:", err);
        alert("로그인 오류");
      });
  }, [location, navigate]);

  return <p>구글 로그인 처리 중...</p>;
}
