import React, { useState, useEffect } from 'react';
import './Hint.scss';
import Footer from './Footer'; // フッターをインポート
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート

function Hint() {
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ローカルストレージからマッチングユーザー情報を取得
  const matchedUser = JSON.parse(localStorage.getItem('matchedUser')) || {};
  const { username, department, discord, user_id } = matchedUser;

  const navigate = useNavigate();

  // アドバイスを生成するAPIリクエストを行う
  const fetchAdvice = async () => {
    try {
      setLoading(true); // 再読み込み時にローディングを表示
      const token = localStorage.getItem('token'); // ログインユーザーのトークンを取得
      const response = await axios.get(
        `https://aichihack-back-153bffff1dd9.herokuapp.com/app/generate-advice/${user_id}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      // ヒントを取得してステートに保存
      setHints(response.data.advice.split('\n'));
      setLoading(false);
    } catch (error) {
      console.error('アドバイスの取得に失敗しました:', error);
      setError('アドバイスの取得に失敗しました。再度お試しください。');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice(); // 初回ロード時にAPIリクエストを実行
  });

  const goToFeedback = () => {
    navigate('/feedback'); // フィードバック画面に遷移
  };

  const reloadAdvice = () => {
    setError(null); // エラーをリセット
    fetchAdvice(); // 再度アドバイスを取得
  };

  return (
    <div className="hint-page">
      <h1 className="hint-page__title">{username}さんと仲を深めるために、以下の点に意識して会話してみましょう</h1>
      <div className="hint-page__profile-info">
        <p><strong>所属:</strong> {department}</p>
        <p><strong>discord:</strong> {discord}</p>
      </div>

      {loading && (
        <div className="loading">
          <p>アドバイスを取得中...</p>
          <div className="spinner"></div> {/* ローディングスピナーを表示 */}
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button className="retry-button" onClick={reloadAdvice}>
            再試行
          </button> {/* 再試行ボタン */}
        </div>
      )}

      {!loading && !error && (
        <div className="hint-page__hint-list">
          {hints.length > 0 ? (
            hints.map((hint, index) => (
              <div key={index} className="hint-page__hint-item">
                <p>{index + 1}. {hint}</p>
              </div>
            ))
          ) : (
            <p>ヒントがありません。</p>
          )}
        </div>
      )}

      <button className="hint-page__button" onClick={goToFeedback}>
        相手の印象を記録する
      </button>

      <Footer /> {/* フッターを追加 */}
    </div>
  );
}

export default Hint;
