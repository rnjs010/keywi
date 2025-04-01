import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import SuggestionItem from '../components/SuggestionItem';

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

interface FeedSearchResult {
  feedId: number;
  content: string;
  taggedProducts?: { name: string }[];
}

interface UserSearchResult {
  userId: number;
  nickname: string;
  brix?: number;
  profileImageUrl?: string;
  profileContent?: string;
}

interface ProductSearchResult {
  productId: number;
  productName: string;
  categoryId?: number;
  categoryName?: string;
  price?: number;
  thumbnailUrl?: string;
}

type TabType = 'feeds' | 'users' | 'products';

export default function SearchPage() {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [feeds, setFeeds] = useState<FeedSearchResult[]>([]);
  const [users, setUsers] = useState<UserSearchResult[]>([]);
  const [products, setProducts] = useState<ProductSearchResult[]>([]);
  const [recentKeywords, setRecentKeywords] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('feeds');

  const debounceRef = useRef<number | null>(null);
  const USER_ID = 1;

  useEffect(() => {
    fetchRecentKeywords();
  }, []);

  const fetchRecentKeywords = async () => {
    try {
      const res = await axios.get<string[]>('/api/search/keywords', {
        params: { userId: USER_ID },
      });
      setRecentKeywords(res.data);
    } catch (err) {
      console.error('최근 검색어 조회 실패', err);
    }
  };

  const deleteAllRecentKeywords = async () => {
    try {
      await axios.delete('/api/search/keywords', {
        params: { userId: USER_ID },
      });
      setRecentKeywords([]);
    } catch (err) {
      console.error('최근 검색어 삭제 실패', err);
    }
  };

  const fetchSuggestions = (value: string) => {
    if (!value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (debounceRef.current !== null) clearTimeout(debounceRef.current);

    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await axios.get<string[]>('/api/autocomplete', {
          params: { query: value },
        });
        setSuggestions(res.data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('자동완성 오류:', err);
      }
    }, 200);
  };

  const handleSearch = async (value: string, tab: TabType = 'feeds') => {
    if (!value.trim()) return;

    try {
      const res = await axios.get(`/api/search`, {
        params: {
          tab,
          query: value,
          page: 0,
          size: 20,
        },
      });

      if (tab === 'feeds') setFeeds(res.data);
      else if (tab === 'users') setUsers(res.data);
      else if (tab === 'products') setProducts(res.data);

      fetchRecentKeywords();
    } catch (err) {
      console.error(`${tab} 검색 오류`, err);
    }
  };

  const handleTabClick = (tab: TabType) => {
    setActiveTab(tab);
    handleSearch(query, tab);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto', position: 'relative' }}>
      <input
        type='text'
        value={query}
        placeholder='검색어 입력'
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          fetchSuggestions(val);
        }}
        onFocus={() => {
          if (query.trim() && suggestions.length > 0) setShowSuggestions(true);
        }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(query, activeTab);
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

      {showSuggestions && suggestions.length > 0 && (
        <ul
          style={{
            border: '1px solid #ccc',
            background: '#fff',
            padding: 0,
            marginTop: '4px',
            position: 'absolute',
            zIndex: 10,
            width: '100%',
            maxHeight: '250px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((text) => (
            <SuggestionItem
              key={text}
              text={text}
              query={query}
              onClick={() => {
                setQuery(text);
                handleSearch(text, activeTab);
                setShowSuggestions(false);
              }}
            />
          ))}
        </ul>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
        {(['feeds', 'users', 'products'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === tab ? '#007bff' : '#e0e0e0',
              color: activeTab === tab ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {{
              feeds: '피드',
              users: '유저',
              products: '상품',
            }[tab]}
          </button>
        ))}
      </div>

      {recentKeywords.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>최근 검색어</h4>
            <button onClick={deleteAllRecentKeywords} style={{ fontSize: '13px', color: '#888', border: 'none', background: 'none', cursor: 'pointer' }}>
              전체 삭제
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {recentKeywords.map((word, i) => (
              <span
                key={i}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setQuery(word);
                  handleSearch(word, activeTab);
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        {activeTab === 'feeds' &&
          feeds.map((item) => (
            <div
              key={item.feedId}
              style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <p>{item.content}</p>
              {item.taggedProducts?.map((p, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#555' }}>
                  상품: {p.name}
                </div>
              ))}
            </div>
          ))}

        {activeTab === 'users' &&
          users.map((u) => (
            <div
              key={u.userId}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
              }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{u.nickname}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>{u.profileContent}</div>
              {u.profileImageUrl && (
                <img
                  src={u.profileImageUrl}
                  alt={u.nickname}
                  style={{ marginTop: '8px', width: '60px', height: '60px', borderRadius: '50%' }}
                />
              )}
            </div>
          ))}

        {activeTab === 'products' &&
          products.map((p) => (
            <div
              key={p.productId}
              style={{
                display: 'flex',
                gap: '16px',
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                alignItems: 'center',
              }}
            >
              {p.thumbnailUrl && (
                <img
                  src={p.thumbnailUrl}
                  alt={p.productName}
                  style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }}
                />
              )}
              <div>
                <div style={{ fontWeight: 'bold' }}>{p.productName}</div>
                <div style={{ fontSize: '14px', color: '#555' }}>{p.categoryName}</div>
                {p.price !== undefined && (
                  <div style={{ fontSize: '14px', color: '#888' }}>
                    가격: {p.price.toLocaleString()}원
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}