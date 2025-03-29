import React from 'react';

const SuggestionItem = ({ text, query, onClick }) => {
  const renderHighlighted = () => {
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={i}>{part}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <li
      onClick={() => onClick(text)}
      style={{
        listStyle: 'none',
        padding: '10px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        color: '#333',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
    >
      {renderHighlighted()}
    </li>
  );
};

export default React.memo(SuggestionItem);
