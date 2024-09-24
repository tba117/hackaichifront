import React, { useState, useEffect, useCallback } from 'react';
import './Hint.scss';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Hint() {
  const [hints, setHints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ローカルストレージからマッチングユーザー情報を取得
  const matchedUser = JSON.parse(localStorage.getItem('matchedUser')) || {};
  const { username, department, discord, user_id } = matchedUser;

  const navigate = useNavigate();

  // アドバイスを取得する関数をuseCallbackでラップ
  const fetchAdvice = useCallback(async () => {
    try {
      console.log('取得開始');
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `https://aichihack-back-153bffff1dd9.herokuapp.com/app/get-advice/${user_id}/`,
        {
          headers: {
            "Authorization": `Token ${token}`,
          },
        }
      );
      console.log(response.data.advice);
      setHints(response.data.advice.split('\n'));
      setLoading(false);
    } catch (error) {
      console.error('アドバイスの取得に失敗しました:', error);
      setError('アドバイスの取得に失敗しました。再度お試しください。');
      setLoading(false);
    }
  }, [user_id]);

  // アドバイス生成を開始する関数をuseCallbackでラップ
  const generateAdvice = useCallback(async () => {
    try {
      console.log("生成開始");
      const token = localStorage.getItem('token');
      await axios.get(
        `https://aichihack-back-153bffff1dd9.herokuapp.com/app/generate-advice/${user_id}/`,
        {
          headers: {
            "Authorization": `Token ${token}`,
          },
        }
      );
      console.log("生成成功");
      fetchAdvice();  // 生成後にアドバイスを取得する
    } catch (error) {
      console.error('アドバイス生成に失敗しました:', error);
      setError('アドバイス生成に失敗しました。再度お試しください。');
      setLoading(false);
    }
  }, [user_id, fetchAdvice]);  // fetchAdviceを依存関係として追加

  useEffect(() => {
    generateAdvice();
  }, [generateAdvice]);  // generateAdviceを依存関係として追加

  const goToFeedback = () => {
    navigate('/feedback');
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
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={generateAdvice}>再試行</button>
        </div>
      )}

      {!loading && !error && hints.length > 0 && (
        <div className="hint-page__hint-list">
          {hints.map((hint, index) => (
            <div key={index} className="hint-page__hint-item">
              <p>{hint}</p>
            </div>
          ))}
        </div>
      )}

      <button className="hint-page__button" onClick={goToFeedback}>
        相手の印象を記録する
      </button>

      <Footer />
    </div>
  );
}

export default Hint;
