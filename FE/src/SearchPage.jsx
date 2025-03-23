import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [tab, setTab] = useState('posts');
  const [results, setResults] = useState([]);
  const [page] = useState(1);
  const [size] = useState(20);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  // 🔍 자동완성
  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get('/api/suggest', {
        params: { keyword: value },
      });
      if (Array.isArray(res.data)) {
        setSuggestions(res.data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('자동완성 오류:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // 🔎 검색
  const handleSearch = async (value) => {
    try {
      const res = await axios.get(`/api/search/${tab}`, {
        params: {
          query: value,
          page,
          size,
        },
      });

      setResults(
        res.data.feeds ||
          res.data.posts ||
          res.data.products ||
          res.data.users ||
          []
      );
      setShowSuggestions(false);
    } catch (err) {
      console.error('검색 실패:', err);
      setResults([]);
    }
  };

  // 탭 바뀔 때 재검색
  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [tab]);

  // 🔽 자동완성 리스트 렌더링
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    return (
      <ul
        style={{
          border: '1px solid #ccc',
          padding: 0,
          marginTop: '4px',
          backgroundColor: '#fff',
          position: 'absolute',
          zIndex: 9999,
          width: '100%',
        }}
      >
        {suggestions.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              setQuery(item.text);
              handleSearch(item.text);
            }}
            style={{
              listStyle: 'none',
              padding: '8px',
              cursor: 'pointer',
              borderBottom: '1px solid #eee',
              backgroundColor: '#fff',
              color: '#000',
            }}
          >
            {item.text}
          </li>
        ))}
      </ul>
    );
  };

  const renderResults = () => (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={() => setTab('posts')}>피드</button>
        <button onClick={() => setTab('products')}>상품</button>
        <button onClick={() => setTab('users')}>계정</button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}
      >
        {tab === 'posts' &&
          results.map((item, idx) => (
            <div key={idx} style={{ border: '1px solid #ccc', padding: '8px' }}>
              <p>{item.content}</p>
              <small>{item.hashtags?.join(' ')}</small>
            </div>
          ))}
        {tab === 'products' &&
          results.map((item) => (
            <div key={item.productId}>{item.productName}</div>
          ))}
        {tab === 'users' &&
          results.map((item) => (
            <div key={item.userId}>
              {item.nickname} (@{item.username})
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <input
        ref={inputRef}
        type='text'
        placeholder='검색어를 입력하세요'
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          fetchSuggestions(val); // 🔥 자동완성 즉시 실행
        }}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(query);
            setShowSuggestions(false);
          }
        }}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      {renderSuggestions()}
      {results.length > 0 && renderResults()}
    </div>
  );
}
