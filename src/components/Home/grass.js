export async function getGithubGrassPublic(username, y = 'last') {
  const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
    username
  )}?y=${encodeURIComponent(y)}`;

  const res = await fetch(url, { headers: { Accept: 'application/json' } });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    // 어떤 상태인지 보이게 에러 메시지에 상태/본문도 같이 붙여줌
    throw new Error(`잔디 조회 실패 (${res.status}) ${text}`);
  }

  return await res.json(); // { total: {...}, contributions: [{date, count, level}, ...] }
}
