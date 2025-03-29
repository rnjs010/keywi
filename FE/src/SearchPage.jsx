import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

const SuggestionItem = React.memo(({ text, query, onClick }) => {
  const highlightMatch = (text, query) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.substring(0, idx)}
        <strong>{text.substring(idx, idx + query.length)}</strong>
        {text.substring(idx + query.length)}
      </>
    );
  };

  return (
    <li
      onClick={onClick}
      style={suggestionItemStyle}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
    >
      {highlightMatch(text, query)}
    </li>
  );
});

const suggestionListStyle = {
  border: '1px solid #e0e0e0',
  borderRadius: '4px',
  padding: 0,
  marginTop: '4px',
  backgroundColor: '#fff',
  position: 'absolute',
  zIndex: 9999,
  width: '100%',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  maxHeight: '300px',
  overflowY: 'auto',
  minHeight: '48px',
  transition: 'opacity 0.2s ease',
};

const suggestionItemStyle = {
  listStyle: 'none',
  padding: '12px 16px',
  cursor: 'pointer',
  borderBottom: '1px solid #eee',
  backgroundColor: '#fff',
  color: '#333',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [results, setResults] = useState([]);
  const [filters] = useState({ hasProducts: false, sort: 'relevance' });
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const debouncedFetchSuggestions = (value) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => fetchSuggestions(value), 200);
  };

  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const res = await axios.get('/api/autocomplete', {
        params: { query: value },
      });
      setSuggestions(res.data.map((text) => ({ text })));
      setShowSuggestions(true);
    } catch (err) {
      console.error('자동완성 오류:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value.trim()) return;
    try {
      const res = await axios.get('/api/search', {
        params: { keyword: value, page: 0, size: 20, ...filters },
      });
      setResults(res.data || []);
    } catch (err) {
      console.error('검색 실패:', err);
    }
  };

  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;
    return (
      <ul style={suggestionListStyle}>
        {suggestions.map((item) => (
          <SuggestionItem
            key={item.text}
            text={item.text}
            query={query}
            onClick={() => {
              setQuery(item.text);
              handleSearch(item.text);
              setShowSuggestions(false);
            }}
          />
        ))}
      </ul>
    );
  };

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
        placeholder='검색어 입력'
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          debouncedFetchSuggestions(val);
        }}
        onFocus={() => {
          if (query.trim() && suggestions.length > 0) setShowSuggestions(true);
        }}
        onBlur={() => {
          setTimeout(() => setShowSuggestions(false), 200);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(query);
            setShowSuggestions(false);
          }
        }}
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
        }}
      />
      {renderSuggestions()}
      <div style={{ marginTop: '20px' }}>
        {results.map((item, idx) => (
          <div
            key={item.postId || idx}
            style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
            }}
          >
            <p>{item.content}</p>
            {item.taggedProducts &&
              item.taggedProducts.map((p, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#555' }}>
                  상품: {p.name}
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
