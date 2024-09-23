import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート
import './DeepQuestions.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // スピナーアイコン

function DeepQuestions() {
  const navigate = useNavigate(); // ナビゲート機能を取得
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // 回答を保存するオブジェクト
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // ローディング状態を追加
  const [saving, setSaving] = useState(false); // プロフィール保存中の状態

  useEffect(() => {
    const fetchGeneratedQuestions = async () => {
      try {
        const user_id = localStorage.getItem('user_id');
        console.log(user_id)
        const response = await axios.get(`https://aichihack-back-153bffff1dd9.herokuapp.com/app/generate-questions/${user_id}/`);

        // 質問を取得
        setQuestions(response.data.questions);
        setLoading(false); // 質問取得が完了したらローディング終了
      } catch (error) {
        console.error('質問の生成に失敗しました。', error);
        setError('質問の生成に失敗しました。');
        setLoading(false); // エラーが発生してもローディング終了
      }
    };

    fetchGeneratedQuestions();
  }, []);

  // 各質問に対する回答を保存
  const handleAnswerChange = (index, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: answer,
    }));
  };

  const handleSaveAnswers = async () => {
    try {
      setSaving(true); // プロフィール保存中の状態に
      const user_id = localStorage.getItem('user_id');

      // 回答をAPIに送信してプロフィールを生成
      const response = await axios.post(
        `https://aichihack-back-153bffff1dd9.herokuapp.com/app/generate-profile/${user_id}/`,
        { answers: Object.values(answers) } // 回答を配列形式で送信
      );

      console.log('プロフィール生成成功:', response.data);

      console.log('プロフィールが生成されました！');
      navigate('/home'); // ボタンを押したらホーム画面に遷移
      setSaving(false); // エラーが発生してもローディング終了
    } catch (error) {
      console.error('プロフィール生成に失敗しました。', error);
      setError('プロフィール生成に失敗しました。');
      setSaving(false); // エラーが発生してもローディング終了
    }
  };

  

  return (
    <div className="deep-questions-container">
      <h1 className="title">あなたのことをさらに詳しく教えてください</h1>
      
      {loading && (
        <div className="spinner-container">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" /> {/* 回転するスピナー */}
          <p>ロード中...</p>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {!loading && questions.map((question, index) => (
        <div className="question-box" key={index}>
          <label>{question}</label>
          <textarea
            className="answer-field"
            placeholder="あなたの回答"
            onChange={(e) => handleAnswerChange(index, e.target.value)} // 回答を保存
          ></textarea>
        </div>
      ))}

      {/* プロフィール保存中のスピナー表示 */}
      {saving && (
        <div className="spinner-container">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" /> {/* 回転するスピナー */}
          <p>プロフィールを保存しています...</p>
        </div>
      )}

      {/* ローディング中でないときに表示 */}
      {!loading && !saving && (
        <button className="save-button" onClick={handleSaveAnswers}>
          回答を保存
        </button>
      )}
    </div>
  );
}

export default DeepQuestions;
