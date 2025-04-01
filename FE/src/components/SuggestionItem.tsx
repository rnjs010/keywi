import React from 'react';

interface Props {
  text: string;
  query: string;
  onClick: () => void;
}

const SuggestionItem: React.FC<Props> = ({ text, query, onClick }) => {
  const highlightMatch = () => {
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
      onClick={onClick}
      style={{
        listStyle: 'none',
        padding: '12px 16px',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
        backgroundColor: '#fff',
        color: '#333',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
    >
      {highlightMatch()}
    </li>
  );
};

export default React.memo(SuggestionItem);
