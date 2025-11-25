// ============================================
// 🔐 AUTH (회원/인증)
// ============================================

// 로그인 - POST /api/auth/login/
// 요청: { email, password }
// 응답: { access, refresh, user: { pk, username, email } }
export const login = async (email, password) => {
  const res = await fetch(`/api/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  console.log('로그인 백엔드 응답:', data);
  
  if (!res.ok) {
    throw new Error(data.detail || '로그인 실패');
  }

  return data; // { access, refresh, user: { pk, username, email } }
};

// 회원가입 - POST /api/auth/registration/
// 요청: { email, username, password1, password2 }
// 응답: { access, refresh, user: { pk, username, email } }
export const register = async (email, password1, password2, name) => {
  const res = await fetch(`/api/auth/registration/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      username: name,
      password1,
      password2,
    }),
  });
  
  const data = await res.json();
  console.log('회원가입 백엔드 응답:', data);
  
  if (!res.ok) {
    const errorMessages = Object.values(data)
      .flat()
      .join(' ');
    throw new Error(errorMessages || '회원가입 실패');
  }
  
  return data; // { access, refresh, user: { pk, username, email } }
};

// Google OAuth 코드 교환 - POST /api/v1/auth/google/
// 요청: { code, redirect_uri }
// 응답: { access, refresh, user }
export const exchangeGoogleCode = async (code, redirectUri) => {
  const res = await fetch("/api/v1/auth/google/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirect_uri: redirectUri }),
  });
  
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(data.detail || data.message || 'Google 코드 교환 실패');
  }
  
  return data;
};

// 토큰 갱신 - POST /api/auth/token/refresh/
// 요청: { refresh }
// 응답: { access }
export const refreshAccess = async () => {
  const refresh = localStorage.getItem('refresh');
  
  if (!refresh) {
    throw new Error('no refresh token');
  }
  
  const res = await fetch('/api/auth/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok || !data.access) {
    throw new Error(data.detail || data.message || '토큰 갱신 실패');
  }
  
  localStorage.setItem('access', data.access);
  return data.access;
};

// 로그아웃 - POST /api/auth/logout/
export const apiLogout = async () => {
  const access = localStorage.getItem('access');
  
  const res = await fetch('/api/auth/logout/', {
    method: 'POST',
    headers: access ? { Authorization: `Bearer ${access}` } : {},
  });
  
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
};

// ============================================
// 👤 PROFILE (백엔드 명세 기준)
// ============================================

// Authorization 헤더 생성 헬퍼 함수
function authHeaders() {
  const access = localStorage.getItem("access");
  return access ? { Authorization: `Bearer ${access}` } : {};
}

// 401 에러 시 토큰 갱신 후 재시도하는 헬퍼 함수
async function tryFetch(factory) {
  let res = await factory();
  
  if (res.status === 401) {
    try {
      await refreshAccess();
      res = await factory(); // 토큰 갱신 후 재시도
    } catch (_) {
      return res;
    }
  }
  
  return res;
}

// ✅ 내 프로필 조회 - GET /api/profiles/me/
// 응답 예시:
// {
//   "id": 3,
//   "display_name": "강승",
//   "bio": "소개글",
//   "job_role": {
//     "id": 5,
//     "name": "백엔드 개발자"
//   }
// }
export async function fetchMyProfile() {
  const res = await tryFetch(() =>
    fetch(`/api/profiles/me/`, {
      method: "GET",
      headers: { ...authHeaders() },
    })
  );
  
  if (!res.ok) {
    throw new Error(`프로필 조회 실패 (${res.status})`);
  }
  
  return res.json();
}

// ✅ 내 프로필 수정 - PUT/PATCH /api/profiles/me/
// 요청 예시:
// {
//   "display_name": "강승",
//   "bio": "소개글",
//   "level": "newgrad",
//   "job_role_id": 5
// }
// JSON 또는 FormData 지원
export async function updateMyProfileJson(payload) {
  const isFormData = payload instanceof FormData;
  
  const headers = {
    ...authHeaders(),
    // FormData일 경우 Content-Type을 설정하지 않음 (브라우저가 자동으로 boundary 설정)
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };

  const body = isFormData ? payload : JSON.stringify(payload);

  const res = await tryFetch(() =>
    fetch(`/api/profiles/me/`, {
      method: "PATCH",
      headers: headers,
      body: body,
    })
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `프로필 수정 실패 (${res.status})`);
  }
  
  return res.json();
}

// ✅ 레벨 목록 조회 - GET /api/profiles/options/levels/
// 응답 예시: [ { "value": "student", "label": "학생" } ]
export async function fetchLevels() {
  const res = await fetch(`/api/profiles/options/levels/`);
  
  if (!res.ok) {
    throw new Error("레벨 목록 조회 실패");
  }
  
  return res.json();
}

// ✅ 직무 카테고리 목록 조회 - GET /api/profiles/options/job-categories/
// 응답 예시: [ { "id": 1, "name": "개발" } ]
export async function fetchJobCategories() {
  const res = await fetch(`/api/profiles/options/job-categories/`);
  
  if (!res.ok) {
    throw new Error("직무 카테고리 조회 실패");
  }
  
  return res.json();
}

// ✅ 직무 목록 조회 - GET /api/profiles/options/job-roles/?group=dev
// 응답 예시: [ { "id": 5, "name": "백엔드 개발자", "group": "dev" } ]
export async function fetchJobRoles(group) {
  const url = group
    ? `/api/profiles/options/job-roles/?group=${encodeURIComponent(group)}`
    : `/api/profiles/options/job-roles/`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error("직무 목록 조회 실패");
  }
  
  return res.json();
}

// ✅ 하드스킬 검색 - GET /api/profiles/options/hard-skills/?q=django
// 응답 예시: [ { "id": 10, "name": "Django", "code": "django" } ]
export async function searchHardSkills(query) {
  const url = `/api/profiles/options/hard-skills/?q=${encodeURIComponent(query)}`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error("하드스킬 검색 실패");
  }
  
  return res.json();
}

// ✅ 소프트스킬 검색 - GET /api/profiles/options/soft-skills/?q=lead
// 응답 예시: [ { "id": 2, "name": "리더십" } ]
export async function searchSoftSkills(query) {
  const url = `/api/profiles/options/soft-skills/?q=${encodeURIComponent(query)}`;
  
  const res = await fetch(url);
  
  if (!res.ok) {
    throw new Error("소프트스킬 검색 실패");
  }
  
  return res.json();
}

// ✅ 직무별 스킬 매핑 조회 - GET /api/profiles/job-roles/{id}/skills/
// 응답 예시:
// {
//   "hard_skills": [ {"id":1,"name":"Python"} ],
//   "soft_skills": [ {"id":2,"name":"Communication"} ]
// }
export async function fetchJobRoleSkills(jobRoleId) {
  const res = await tryFetch(() =>
    fetch(`/api/profiles/job-roles/${jobRoleId}/skills/`, {
      method: "GET",
      headers: { ...authHeaders() },
    })
  );
  
  if (!res.ok) {
    throw new Error(`직무 스킬 조회 실패 (${res.status})`);
  }
  
  return res.json();
}

// ✅ 직무별 스킬 매핑 저장 - POST /api/profiles/job-roles/{id}/skills/
// 요청 예시: { "hard_ids": [1,2], "soft_ids": [3,4] }
export async function saveJobRoleSkills(jobRoleId, hardIds, softIds) {
  const res = await tryFetch(() =>
    fetch(`/api/profiles/job-roles/${jobRoleId}/skills/`, {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hard_ids: hardIds,
        soft_ids: softIds,
      }),
    })
  );
  
  if (!res.ok) {
    throw new Error(`직무 스킬 저장 실패 (${res.status})`);
  }
  
  return res.json();
}

// ============================================
// 🔑 PASSWORD RESET
// ============================================

// 비밀번호 재설정 요청 - POST /api/password_reset/
export async function requestPasswordReset(email) {
  const res = await fetch("/api/password_reset/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  
  if (!res.ok) {
    throw new Error("비밀번호 재설정 요청 실패");
  }
  
  return res.json();
}

// 토큰 유효성 검증 - POST /api/password_reset/validate_token/
export async function validateResetToken(token) {
  const res = await fetch("/api/password_reset/validate_token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  
  if (!res.ok) {
    throw new Error("유효하지 않은 토큰");
  }
  
  return res.json();
}

// 비밀번호 재설정 확인 - POST /api/password_reset/confirm/
export async function confirmPasswordReset(token, password) {
  const res = await fetch("/api/password_reset/confirm/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  
  if (!res.ok) {
    throw new Error("비밀번호 변경 실패");
  }
  
  return res.json();
}

// ============================================
// 📋 ACTIVITIES (경험/활동)
// ============================================

export async function fetchActivityDetail(activityId) {
  const res = await tryFetch(() =>
    fetch(`/api/activities/${activityId}/`, {
      method: "GET",
      headers: { ...authHeaders() },
    })
  );
  
  if (!res.ok) {
    throw new Error(`경험 상세 조회 실패 (${res.status})`);
  }
  
  return res.json();
}