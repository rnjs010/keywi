import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  productId: number;
  productName: string;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  price: number;
}

interface Props {
  categoryId: number;
  categoryName: string;
  onSelect: (product: Product) => void;
  onClose: () => void;
}

export default function ProductSearchModal({ categoryId, categoryName, onSelect, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (!searchQuery.trim()) return;
      axios
        .get('/api/board/products/autocomplete', {
          params: { categoryId, query: searchQuery, size: 10 },
        })
        .then((res) => setSuggestions(res.data))
        .catch((err) => console.error('자동완성 실패', err));
    }, 200);

    return () => clearTimeout(debounce);
  }, [searchQuery, categoryId]);

  const fetchFullResults = async (newPage: number) => {
    try {
      const res = await axios.get('/api/board/products/search', {
        params: { categoryId, query: searchQuery, page: newPage, size: 10 },
      });
      setSuggestions(res.data);
      setPage(newPage);
    } catch (err) {
      console.error('전체 검색 실패', err);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '8px',
          padding: '20px',
          width: '420px',
          textAlign: 'center',
        }}
      >
        <h3>{categoryName} 검색</h3>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`${categoryName} 상품 검색`}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginBottom: '12px',
          }}
        />

        <ul style={{ maxHeight: '300px', overflowY: 'auto', padding: 0, margin: 0 }}>
          {suggestions.map((item) => (
            <li
              key={item.productId}
              onClick={() => {
                onSelect(item);
              }}
              style={{
                listStyle: 'none',
                marginBottom: '12px',
                display: 'flex',
                gap: '12px',
                textAlign: 'left',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
              <div>
                <div style={{ fontWeight: 'bold' }}>{item.productName}</div>
                <div style={{ color: '#666', fontSize: '14px' }}>{item.price.toLocaleString()}원</div>
              </div>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: '12px' }}>
          <button onClick={() => fetchFullResults(page - 1)} disabled={page === 0}>
            ◀ 이전
          </button>
          <button onClick={() => fetchFullResults(page + 1)} style={{ marginLeft: '8px' }}>
            다음 ▶
          </button>
        </div>

        <button onClick={onClose} style={{ marginTop: '16px' }}>
          닫기
        </button>
      </div>
    </div>
  );
}