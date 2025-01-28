import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // axiosをインポート
import './Signup.scss'; // スタイルをインポート

function Signup() {
  const navigate = useNavigate(); // useNavigateフックでページ遷移を管理
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
  });

  // フォームの値が変更されたときに更新
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError(''); // エラーをリセット
    try {
      // バックエンドAPIにPOSTリクエストを送信
      const response = await axios.post('https://aichihack-back-153bffff1dd9.herokuapp.com/app/signup/', {
        user_id: formData.userId,
        username: formData.name,
        password: formData.password,
      });

      console.log('登録成功:', response.data);

      // 登録成功後、ログインに必要なトークンを取得
      const token = response.data.token;
      const user_id = response.data.user_id;
      const id = response.data.id; // サーバーから取得したID

      // トークンをlocalStorageに保存
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('id', id);

      // 登録成功後、プロフィール作成ページに遷移
      navigate('/profile-setup', { state: { id } });
    } catch (error) {
      console.error('エラー:', error.response.data);
      setError('登録に失敗しました。再度お試しください。');
    }
  };

  const goToLogin = () => {
    navigate('/login'); // ログイン画面に遷移
  };

  return (
    <div className="auth-page">
      <h1 className="auth-page__title">Biz Mate</h1>
      <div className="auth-page__box">
        <h2 className="auth-page__header">アカウント作成</h2>
        <form className="auth-page__form" onSubmit={handleSignup}>
        <input
            type="text"
            name="name"
            placeholder="ニックネーム"
            value={formData.name}
            onChange={handleChange}
            className="auth-page__input"
            required
          />
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
          <button className="auth-page__button" type="submit">登録</button>
        </form>
        <p className="auth-page__link">
          すでにアカウントを持っていますか？ <span onClick={goToLogin} className="auth-page__link-text">ログインはこちら</span>
        </p>
      </div>
    </div>
  );
}

export default Signup;
