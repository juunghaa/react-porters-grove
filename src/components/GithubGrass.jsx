import { useEffect, useState } from 'react';
import { getGithubGrassPublic } from './Home/grass';

export default function GithubGrass({ username, year = 'last' }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setErr('');
        const d = await getGithubGrassPublic(username.trim(), year);
        setData(d);
      } catch (e) {
        const msg = String(e?.message || '');
        if (msg.includes('(404)')) {
          setErr('해당 GitHub 사용자(ID)를 찾을 수 없습니다. 아이디를 확인해 주세요.');
        } else {
          setErr('잔디 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
        }
        console.error(e);
      }
    })();
  }, [username, year]);

  if (!data) return <div>잔디 불러오는 중…</div>;
  const days = data.days ?? data.contributions ?? [];

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(7,12px)', gap:4}}>
      {days.slice(-31).map(d => (
        <div key={d.date}
          title={`${d.date}: ${d.contributionCount ?? d.count}`}
          style={{
            width:12, height:12, borderRadius:2,
            background: colorFromLevel(d.level, d.contributionCount ?? d.count)
          }}
        />
      ))}
    </div>
  );
}

function colorFromLevel(level, count) {
  if (typeof level === 'number') {
    return ['#ebedf0','#c6e48b','#7bc96f','#239a3b','#196127'][Math.max(0, Math.min(4, level))];
  }
  if (!count) return '#ebedf0';
  if (count === 1) return '#c6e48b';
  if (count <= 3) return '#7bc96f';
  if (count <= 6) return '#239a3b';
  return '#196127';
}
