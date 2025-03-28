import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// axios 기본 설정
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [tab, setTab] = useState('posts');
  const [results, setResults] = useState([]);
  const [page] = useState(1);
  const [size] = useState(20);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const [filters, setFilters] = useState({
    hasProducts: false,
    sort: 'relevance'
  });

  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  const fetchSuggestions = async (value) => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get('/api/autocomplete', {
        params: { query: value },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const suggestionItems = res.data.map(text => ({ text }));
      setSuggestions(suggestionItems);
      setShowSuggestions(true);
    } catch (err) {
      console.error('자동완성 오류:', err);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchSuggestions = (value) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSearch = async (value) => {
    if (!value.trim()) return;
    setSearching(true);
    try {
      const searchParams = {
        keyword: value,
        page: page - 1,
        size,
        ...filters
      };
      const res = await axios.get('/api/search', {
        params: searchParams,
      });
      setResults(res.data || []);
      setShowSuggestions(false);
    } catch (err) {
      console.error('검색 실패:', err);
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [tab, filters]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const renderSuggestions = () => {
    if (!showSuggestions || (suggestions.length === 0 && !isLoading)) return null;
    return (
      <ul style={{
        border: '1px solid #e0e0e0', borderRadius: '4px', padding: 0,
        marginTop: '4px', backgroundColor: '#fff', position: 'absolute',
        zIndex: 9999, width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxHeight: '300px', overflowY: 'auto'
      }}>
        {isLoading ? (
          <li style={{ listStyle: 'none', padding: '12px 16px', textAlign: 'center', color: '#666' }}>검색 중...</li>
        ) : suggestions.length > 0 ? (
          suggestions.map((item, index) => (
            <li key={index} onClick={() => {
              setQuery(item.text);
              handleSearch(item.text);
              setShowSuggestions(false);
            }} style={{
              listStyle: 'none', padding: '12px 16px', cursor: 'pointer',
              borderBottom: '1px solid #eee', backgroundColor: '#fff', color: '#333'
            }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}>{item.text}</li>
          ))
        ) : (
          <li style={{ listStyle: 'none', padding: '12px 16px', textAlign: 'center', color: '#666' }}>검색 결과가 없습니다</li>
        )}
      </ul>
    );
  };

  const renderFilters = () => (
    <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>필터 옵션</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
          <input type="checkbox" checked={filters.hasProducts} 
            onChange={(e) => handleFilterChange({ hasProducts: e.target.checked })} style={{ marginRight: '5px' }} />
          상품 태그 포함
        </label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', marginRight: '8px' }}>정렬:</span>
          <select value={filters.sort} onChange={(e) => handleFilterChange({ sort: e.target.value })} style={{ padding: '5px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}>
            <option value="relevance">관련성</option>
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div>
      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', padding: '5px', borderBottom: '1px solid #eee' }}>
        <button onClick={() => setTab('posts')} style={{ padding: '8px 16px', backgroundColor: tab === 'posts' ? '#007BFF' : '#f8f9fa', color: tab === 'posts' ? 'white' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>게시물</button>
        <button onClick={() => setTab('products')} style={{ padding: '8px 16px', backgroundColor: tab === 'products' ? '#007BFF' : '#f8f9fa', color: tab === 'products' ? 'white' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>상품</button>
      </div>
      {renderFilters()}
      {searching ? (
        <div style={{ padding: '30px', textAlign: 'center', fontSize: '16px', color: '#666' }}>검색 중...</div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {results.map((item, idx) => (
              <div key={item.postId || idx} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#333', lineHeight: '1.5' }}>{item.content}</p>
                {item.hashtags && item.hashtags.length > 0 && (
                  <div style={{ marginBottom: '10px' }}>
                    {item.hashtags.map((tag, tagIdx) => (
                      <span key={tagIdx} style={{ display: 'inline-block', backgroundColor: '#f0f7ff', color: '#0366d6', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginRight: '5px', marginBottom: '5px' }}>#{tag}</span>
                    ))}
                  </div>
                )}
                {item.taggedProducts && item.taggedProducts.length > 0 && (
                  <div style={{ marginTop: '8px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>태그된 상품:</div>
                    {item.taggedProducts.map((product, productIdx) => (
                      <div key={productIdx} style={{ fontSize: '13px', padding: '5px', backgroundColor: '#fafafa', borderRadius: '4px', marginBottom: '5px' }}>{product.name}</div>
                    ))}
                  </div>
                )}
                {item.createdAt && (
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>{new Date(item.createdAt).toLocaleDateString()}</div>
                )}
              </div>
            ))}
          </div>
          {results.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              검색 결과가 없습니다
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px', color: '#333' }}>통합 검색</h1>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <input
          ref={inputRef}
          type='text'
          placeholder='검색어를 입력하세요 (초성 검색 가능)'
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
            width: '100%', padding: '12px 16px', fontSize: '16px', border: '1px solid #e0e0e0',
            borderRadius: '4px', outline: 'none', transition: 'border-color 0.2s',
          }}
        />
        {renderSuggestions()}
      </div>
      {query && results.length > 0 && renderResults()}
      {query && results.length === 0 && !searching && (
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px', color: '#666' }}>
          <div style={{ marginBottom: '10px', fontSize: '18px' }}>검색 결과가 없습니다</div>
          <div style={{ fontSize: '14px' }}>다른 검색어로 시도해보세요</div>
        </div>
      )}
      {searching && (
        <div style={{ padding: '30px', textAlign: 'center', fontSize: '16px', color: '#666' }}>
          검색 중...
        </div>
      )}
    </div>
  );
}
