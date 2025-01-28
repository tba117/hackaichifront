import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import './Signup.scss'; // スタイルを再利用
import { UserContext } from './UserContext'; // UserContext をインポート

function Login() {
  const navigate = useNavigate(); // ページ遷移を管理
  const { saveUser } = useContext(UserContext); // Context の関数を取得
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

      // レスポンスからアクセストークンとリフレッシュトークンを取得
      const token = response.data.token;
      const user_id = response.data.user_id;
      const id = response.data.id;

      // トークンをlocalStorageに保存
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('id', id);

      // ユーザー情報を取得
      const userResponse = await axios.get(`https://aichihack-back-153bffff1dd9.herokuapp.com/app/users/${user_id}/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      const userData = userResponse.data.user;

      // Context にユーザー情報を保存
      saveUser({
        id: userData.id,
        username: userData.username,
        userId: userData.user_id,
        department: userData.department,
        discord: userData.snsid,
        hobbies: userData.hobbys,
        skills: userData.skills,
        selfIntroduction: userData.selfIntroduction,
        chatroom: userData.related_chat_rooms,
      });

      console.log('ログイン成功:', userData);

      // ログイン成功後、深堀質問ページに遷移
      navigate('/deep-questions');
    } catch (error) {
      console.error('ログインエラー:', error.response?.data || error.message);
      setError('ログインに失敗しました。再度お試しください。');
    }
  };

  const goToLogin = () => {
    navigate('/signup'); // ログイン画面に遷移
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
            placeholder="ユーザ ID"
            value={formData.userId}
            onChange={handleChange}
            className="auth-page__input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="パスワード"
            value={formData.password}
            onChange={handleChange}
            className="auth-page__input"
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button className="auth-page__button" type="submit" onClick={handleLogin}>ログイン</button>
          <p className="auth-page__link">
            まだ登録していませんか？ <span onClick={goToLogin} className="auth-page__link-text">ここから始めよう</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
