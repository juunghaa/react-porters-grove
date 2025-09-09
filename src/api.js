
// const BASE_URL = process.env.REACT_APP_API_URL;

// 로그인
export const login = async (email, password) => {
  const res = await fetch(`/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password }),
  });

  const data = await res.json();
  console.log('로그인 백엔드 응답:', data);
  if (!res.ok) {
    throw new Error(data.detail || '로그인 실패');
  }

  // 토큰 및 사용자 정보 반환
  return data; // { access, refresh, user }
};


// 회원가입 
export const register = async (email, password1, password2) => {
    const res = await fetch(`/api/auth/registration/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: email,
            email,
            password1,
            password2,
        }),
    });
    const data = await res.json();
    console.log('회원가입 백엔드 응답:', data);
    
    if (!res.ok) {
        // 백엔드에서 에러 메시지들이 객체로 올 수 있어서 예쁘게 정리
        const errorMessages = Object.values(data)
        .flat()
        .join(' ');
        throw new Error(errorMessages || '회원가입 실패');
    }
    return data; // { access, refresh, user }
};


export const exchangeGoogleCode = async (code, redirectUri) => {
    const res = await fetch('/api/auth/google/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || data.message || 'Google 코드 교환 실패');
    return data;
  };
  
  export const exchangeGithubCode = async (code, redirectUri) => {
    const res = await fetch('/api/auth/github/login/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || data.message || 'GitHub 코드 교환 실패');
    return data;
  };
  


// 구글 로그인 - 소셜 로그인 ****만약 백엔드 올인 -> api 구글 로그인은 필요 없음!!
// 백엔드 올인 아닐 경우 api.js 필요하니까 수정해야 함.... 
// export const googleLogin = async (code) => {
//     const res = await fetch(`/api/auth/google/`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ code }),
//     });
    
//     if (!res.ok) {
//         const error = await res.json();
//         throw new Error(error.message || 'Google 로그인 실패');
//     }
    
//     return await res.json();  // access, refresh 토큰이 포함된 응답 객체
// };


// 토큰 갱신 (옵션: 401일 때 한 번만 시도)
export const refreshAccess = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('no refresh token');
    const res = await fetch('/api/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access) throw new Error(data.detail || data.message || '토큰 갱신 실패');
    localStorage.setItem('access', data.access);
    return data.access;
};

// 로그아웃
export const apiLogout = async () => {
    const access = localStorage.getItem('access');
    const res = await fetch('/api/auth/logout/', {
        method: 'POST',
        headers: access ? { Authorization: `Bearer ${access}` } : {},
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
};

// 내 프로필 조회
// export const getMyProfile = async (token) => {
//   const res = await fetch(`/api/profiles/me/`, {
//     headers: {
//       'Authorization': `Bearer ${token}`,
//     },
//   });
//   return await res.json();
// };

// src/api/profile.js
// const BASE = process.env.REACT_APP_API_BASE || ""; // 예: "https://api.yourhost.com"

function authHeaders() {
  const access = localStorage.getItem("access");
  return access ? { Authorization: `Bearer ${access}` } : {};
}

export async function fetchMyProfile() {
//   const res = await fetch(`/api/profiles/me/`, {
//     method: "GET",
//     headers: { ...authHeaders() },
//   });
    const res = await tryFetch(() =>
      fetch(`/api/profiles/me/`, {
        method: "GET",
        headers: { ...authHeaders() },
      })
    );
    
  if (!res.ok) throw new Error(`프로필 조회 실패 (${res.status})`);
  return res.json();
}

export async function updateMyProfileJson(payload) {
//   const res = await fetch(`/api/profiles/me/`, {
//     method: "PATCH",
//     headers: { ...authHeaders(), "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });
     const res = await tryFetch(() =>
       fetch(`/api/profiles/me/`, {
        //  method: "PATCH",
         method: "PUT",
         headers: { ...authHeaders(), "Content-Type": "application/json" },
         body: JSON.stringify(payload),
       })
     );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `프로필 수정 실패 (${res.status})`);
  }
  return res.json();
}

// (선택) 아바타 업로드: multipart/form-data
// export async function updateMyProfileAvatar(file, extra = {}) {
//   const fd = new FormData();
//   fd.append("avatar", file);
//   Object.entries(extra).forEach(([k, v]) => fd.append(k, v));
//   const res = await fetch(`${BASE}/api/profiles/me/`, {
//     method: "PATCH",
//     headers: { ...authHeaders() }, // form-data는 Content-Type 설정 X (브라우저가 boundary 설정)
//     body: fd,
//   });
//   if (!res.ok) throw new Error(`아바타 업로드 실패 (${res.status})`);
//   return res.json();
// }

export async function fetchLevels() {
  const res = await fetch(`/api/profiles/options/levels/`);
  if (!res.ok) throw new Error("레벨 목록 조회 실패");
  return res.json();
}

export async function fetchJobRoles(group) {
  const url = group
    ? `/api/profiles/options/job-roles/?group=${encodeURIComponent(group)}`
    : `/api/profiles/options/job-roles/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("직무 목록 조회 실패");
  return res.json();
}

// 401나면 한 번만 토큰 갱신 후 재요청
async function tryFetch(factory) {
  let res = await factory();
  if (res.status === 401) {
    try { await refreshAccess(); } catch (_) { return res; }
    res = await factory();
  }
  return res;
}