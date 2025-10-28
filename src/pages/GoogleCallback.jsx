// src/pages/GoogleCallback.jsx
import { useEffect } from "react";

export default function GoogleCallback({ onLoginSuccess }) {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");

    if (code) {
      const redirectUri =
        "http://react-porters-grove.vercel.app/google/callback/";

      // Django 백엔드로 code + redirect_uri 전송
      fetch("http://52.79.131.1/api/v1/auth/google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ 서버 응답:", data);

          // JWT 저장 후 리다이렉트
          if (data.access) {
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            // ✅ App.js의 상태 업데이트
            if (onLoginSuccess) onLoginSuccess(data);

            // 홈으로 리디렉트
            window.location.href = "/";
          } else {
            console.error("❌ 토큰이 응답에 없음:", data);
          }
        })
        .catch((err) => console.error("❌ 로그인 실패:", err));
    } else {
      console.error("❌ code 파라미터가 없습니다.");
    }
  }, [onLoginSuccess]);

  return <p>Google 로그인 처리 중…</p>;
}
