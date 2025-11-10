// // src/pages/GoogleCallback.jsx
// import { useEffect } from "react";

// export default function GoogleCallback({ onLoginSuccess }) {
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const access = params.get("access");
//     const refresh = params.get("refresh");

//     if (access && refresh) {
//       console.log("✅ 서버에서 토큰 수신 성공");
//       localStorage.setItem("access", access);
//       localStorage.setItem("refresh", refresh);

//       if (onLoginSuccess) onLoginSuccess({ access, refresh });
//       window.location.href = "/";
//     } else {
//       console.error("❌ JWT 토큰이 URL에 포함되어 있지 않습니다.");
//     }
//   }, [onLoginSuccess]);

//   return <p>Google 로그인 처리 중…</p>;
// }





// // src/pages/GoogleCallback.jsx
// import { useEffect } from "react";

// export default function GoogleCallback({ onLoginSuccess }) {
//   useEffect(() => {
//     const code = new URLSearchParams(window.location.search).get("code");

//     if (code) {
//       const redirectUri =
//         "https://react-porters-grove.vercel.app/google/callback/";

//       // Django 백엔드로 code + redirect_uri 전송
//       fetch("https://grove.beer/api/v1/auth/google/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ code, redirect_uri: redirectUri }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("✅ 서버 응답:", data);

//           // JWT 저장 후 리다이렉트
//           if (data.access) {
//             localStorage.setItem("access", data.access);
//             localStorage.setItem("refresh", data.refresh);

//             // ✅ App.js의 상태 업데이트
//             if (onLoginSuccess) onLoginSuccess(data);

//             // 홈으로 리디렉트
//             window.location.href = "/";
//           } else {
//             console.error("❌ 토큰이 응답에 없음:", data);
//           }
//         })
//         .catch((err) => console.error("❌ 로그인 실패:", err));
//     } else {
//       console.error("❌ code 파라미터가 없습니다.");
//     }
//   }, [onLoginSuccess]);

//   return <p>Google 로그인 처리 중…</p>;
// }


// src/pages/GoogleCallback.jsx
import { useEffect, useState } from "react";

export default function GoogleCallback({ onLoginSuccess }) {
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("처리 중...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // ✅ Option A: 백엔드가 이미 JWT를 쿼리 파라미터로 반환한 경우
    const access = params.get("access");
    const refresh = params.get("refresh");
    
    // ✅ Option B: Google에서 받은 authorization code
    const code = params.get("code");
    const state = params.get("state");

    // Option A: JWT 토큰이 이미 있는 경우
    if (access && refresh) {
      console.log("✅ [Option A] 백엔드에서 JWT 토큰 수신 완료");
      setStatus("로그인 성공! 메인 페이지로 이동 중...");
      
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      if (onLoginSuccess) {
        onLoginSuccess({ access, refresh });
      }

      // 메인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }

    // Option B: authorization code가 있는 경우 - 백엔드로 전송
    if (code) {
      console.log("✅ [Option B] Google authorization code 수신:", code);
      setStatus("백엔드에서 토큰 교환 중...");

      // 방법 1: GET 요청으로 백엔드 callback 엔드포인트 호출
      // (백엔드가 알아서 리다이렉트해주는 경우)
      const backendCallbackUrl = `https://grove.beer/api/v1/auth/google/callback/?code=${code}${state ? `&state=${state}` : ''}`;
      
      // 또는 방법 2: POST 요청으로 직접 토큰 받기
      fetch("https://grove.beer/api/v1/auth/google/callback/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          code: code,
          state: state || null
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ 백엔드 응답 에러:", errorText);
            throw new Error(`서버 에러 (${res.status}): ${errorText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("✅ 백엔드 응답 성공:", data);

          // JWT 저장
          if (data.access && data.refresh) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            if (onLoginSuccess) {
              onLoginSuccess(data);
            }

            setStatus("로그인 성공! 메인 페이지로 이동 중...");
            setTimeout(() => {
              window.location.href = "/";
            }, 500);
          } else {
            console.error("❌ 토큰이 응답에 없음:", data);
            setError("토큰을 받지 못했습니다.");
          }
        })
        .catch((err) => {
          console.error("❌ 로그인 실패:", err);
          setError(err.message || "로그인 처리 중 오류가 발생했습니다.");
          setStatus("로그인 실패");
          
          // 3초 후 로그인 페이지로 리다이렉트
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        });
      
      return;
    }

    // code도 token도 없는 경우
    console.error("❌ URL에 code나 token이 없습니다.");
    setError("인증 정보가 없습니다.");
    setStatus("로그인 실패");
    
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);

  }, [onLoginSuccess]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif'
    }}>
      <h2>Google 로그인</h2>
      <p>{status}</p>
      {error && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          ⚠️ {error}
        </p>
      )}
      <div style={{ marginTop: '20px' }}>
        <div className="spinner" style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}