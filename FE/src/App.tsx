import React from 'react';
import SearchPage from './pages/SearchPage';
import BoardProductSearchPage from './pages/BoardProductSearchPage';
import KeywordRanking from './components/KeywordRanking';


function App() {
  return (
    <div>
      <SearchPage />
      <BoardProductSearchPage />
      <KeywordRanking />
    </div>
  );
}

export default App;
