import React from 'react';
import './Hint.scss';
import Footer from './Footer'; // フッターをインポート
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

function Hint({ hints, name, department, discord }) {
  const navigate = useNavigate(); // ページ遷移用のフック

  const goToFeedback = () => {
    navigate('/feedback'); // フィードバック画面に遷移
  };

  return (
    <div className="hint-container">
      <h1 className="title">{name}さんと仲を深めるために、以下の点に意識して会話してみましょう</h1>
      <div className="profile-info">
        <p><strong>所属:</strong> {department}</p>
        <p><strong>discord:</strong> {discord}</p>
      </div>
      <div className="hint-list">
        {hints && hints.length > 0 ? (
          hints.map((hint, index) => (
            <div key={index} className="hint-item">
              <p>{index + 1}. {hint}</p>
            </div>
          ))
        ) : (
          <p>ヒントがありません。</p>
        )}
      </div>

      {/* 「相手の印象を記録する」ボタンを追加 */}
      <button className="record-button" onClick={goToFeedback}>
        相手の印象を記録する
      </button>

      <Footer /> {/* フッターを追加 */}
    </div>
  );
}

export default Hint;
