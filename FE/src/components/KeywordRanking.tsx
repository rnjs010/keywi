import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface KeywordRank {
  timeBlock: string;
  keyword: string;
  ranking: number;
  changeStatus: 'NEW' | 'UP' | 'DOWN' | 'SAME' | 'NONE';
}

const KeywordRanking: React.FC = () => {
  const [rankings, setRankings] = useState<KeywordRank[]>([]);

  useEffect(() => {
    axios.get<KeywordRank[]>('/api/search/rankings/latest')
      .then((res) => {
        setRankings(res.data);
      })
      .catch((err) => {
        console.error('🔥 랭킹 불러오기 실패:', err);
      });
  }, []);

  return (
    <div>
      <h2>🔥 인기 검색어 랭킹</h2>
      <ul>
        {rankings.map((rank) => (
          <li key={rank.ranking}>
            #{rank.ranking} {rank.keyword}  
            <span style={{ marginLeft: '10px', color: 'gray' }}>
              {rank.changeStatus === 'NEW' && '🆕'}
              {rank.changeStatus === 'UP' && '🔺'}
              {rank.changeStatus === 'DOWN' && '🔻'}
              {rank.changeStatus === 'SAME' && '⏺️'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KeywordRanking;
