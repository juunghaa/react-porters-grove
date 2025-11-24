// src/pages/GoogleCallback.jsx
import { useEffect, useRef, useState } from "react";

export default function GoogleCallback({ onLoginSuccess }) {
  const [status, setStatus] = useState("처리 중...");
  const [debugInfo, setDebugInfo] = useState(null);
  const processedRef = useRef(false); // 이미 처리했는지 여부

  useEffect(() => {
    if (processedRef.current) return; // 중복 실행 방지
    processedRef.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const redirectUri =
      "https://react-porters-grove.vercel.app/google/callback/";

    if (!code) {
      setStatus("인증 코드가 없습니다.");
      return;
    }

    (async () => {
      try {
        setStatus("백엔드로 인증 코드 전송 중...");
        const backendUrl = "https://grove.beer/api/v1/auth/google/";
        const response = await fetch(backendUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code, redirect_uri: redirectUri }),
        });

        const responseText = await response.text();
        setDebugInfo({
          url: backendUrl,
          status: response.status,
          responseText: responseText.substring(0, 500),
        });

        if (!response.ok)
          throw new Error(`HTTP ${response.status}: ${responseText}`);

        const data = JSON.parse(responseText);
        if (data?.access) localStorage.setItem("access", data.access);
        if (data?.refresh) localStorage.setItem("refresh", data.refresh);
        if (data?.user)
          localStorage.setItem("user", JSON.stringify(data.user));
        if (onLoginSuccess) onLoginSuccess(data);

        setStatus("로그인 성공! 메인 페이지로 이동 중...");
        setTimeout(() => window.location.replace("/"), 1000);
      } catch (err) {
        console.error("구글 로그인 실패:", err);
        setStatus(`로그인 실패: ${err.message}`);
      }
    })();
  }, [onLoginSuccess]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "monospace",
        backgroundColor: "#f5f5f5",
      }}
    >
      <h2>Google 로그인 디버그</h2>
      <p style={{ marginTop: "20px", fontSize: "16px" }}>{status}</p>

      {debugInfo && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#fff",
            border: "2px solid #ddd",
            borderRadius: "8px",
            maxWidth: "800px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <h3>🔍 디버그 정보</h3>
          <p>
            <strong>URL:</strong> {debugInfo.url}
          </p>
          <p>
            <strong>Status:</strong> {debugInfo.status}
          </p>
          <p>
            <strong>Response:</strong>
          </p>
          <pre
            style={{
              backgroundColor: "#f5f5f5",
              padding: "10px",
              overflow: "auto",
              fontSize: "12px",
            }}
          >
            {debugInfo.responseText}
          </pre>
        </div>
      )}
    </div>
  );
}
