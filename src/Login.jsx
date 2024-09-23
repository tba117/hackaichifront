import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import './Signup.scss'; // スタイルを再利用

function Login() {
  const navigate = useNavigate(); // ページ遷移を管理
  const [error, setError] = useState(''); // エラーメッセージの管理
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
  });

  // フォームの入力値を更新する関数
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ログイン処理を行う関数
  const handleLogin = async (event) => {
    event.preventDefault();
    setError(''); // エラーをリセット
    try {
      // バックエンドのログインAPIにPOSTリクエストを送信
      const response = await axios.post('https://aichihack-back-153bffff1dd9.herokuapp.com/app/login/', {
        user_id: formData.userId,
        password: formData.password,
      });

      console.log('ログイン成功:', response.data);

      // レスポンスからアクセストークンとリフレッシュトークンを取得
      const token = response.data.token;
      const user_id = response.data.user_id;
      console.log("token:", token)
      console.log("user_id:", user_id)

      // トークンをlocalStorageに保存
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);

      // ログイン成功後、深堀質問ページに遷移
      navigate('/deep-questions');
    } catch (error) {
      console.error('ログインエラー:', error.response?.data || error.message);
      setError('ログインに失敗しました。再度お試しください。');
    }
  };

  return (
    <div className="auth-page"> {/* CSSをSignupと共有 */}
      <h1 className="auth-page__title">Biz Mate</h1>
      <div className="auth-page__box">
        <h2 className="auth-page__header">ログイン</h2>
        <form className="auth-page__form" onSubmit={handleLogin}>
        <input
            type="text"
            name="userId"
            placeholder="user ID"
            value={formData.userId}
            onChange={handleChange}
            className="auth-page__input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            className="auth-page__input"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button className="auth-page__button" type="submit" onClick={handleLogin}>Login</button> {/* ログイン処理 */}
        </form>
      </div>
    </div>
  );
}

export default Login;
