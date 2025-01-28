import React, { useState, useContext, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import axios from 'axios';
import './Chatlist.scss'; // スタイルの読み込み
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons'; // スピナーアイコン
import { UserContext } from './UserContext'; // UserContext をインポート

function Chatlist() {
  const { user } = useContext(UserContext); // UserContext からログインユーザー情報を取得
  const [chatRooms, setChatRooms] = useState([]); // チャットルーム一覧を格納
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(''); // エラーメッセージ
  const navigate = useNavigate();

  console.log('useContext user', user)

  // チャットルーム一覧を取得する関数
  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('https://aichihack-back-153bffff1dd9.herokuapp.com/app/chat/get/', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(response.data.chat_rooms)
      setChatRooms(response.data.chat_rooms); // チャットルーム情報をステートに保存
      setLoading(false);
    } catch (err) {
      console.error('チャットルームの取得に失敗しました:', err);
      setError('まだチャットルームがありません。');
      setLoading(false);
    }
  };

  // ページロード時にチャットルーム一覧を取得
  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleRoomClick = (room) => {
    // プロフィールをクリックしたら、BMProfileページに遷移
    navigate('/chatroom', { state: { room } });
  };

  if (loading) {
    return (
      <div className="matched-list-page">
        <FontAwesomeIcon icon={faSpinner} spin size="3x" /> {/* 回転するスピナー */}
        <p>ロード中...</p>
      </div>
    ); // ローディング画面
  }

  if (error || chatRooms.length === 0) {
    return (
      <div className="matched-list-page">
        <p className="matched-list-page_error">
          チャットルームがありません
        </p>
      </div>
    );
  };

  return (
    <div className="matched-list-page">
      <h1 className="matched-list-page__title">Chat List</h1>
      <ul className="matched-list-page__list">
      {chatRooms.map((room, index) => {
          // 自分以外のユーザーを取得
          const otherUser = room.users.find((u) => u.id !== user.id);
          console.log('otherUser:', otherUser)
          console.log('useContext user', user)
          console.log('user.id:', user.id)
          return (
            <li
              key={index}
              className="matched-list-page__item"
              onClick={() => handleRoomClick(room)}
            >
              <div className="matched-list-page__icon">👤</div>
              <div className="matched-list-page__details">
                {/* 自分以外の名前を表示 */}
                <p>{otherUser ? otherUser.username : 'No other users'}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Chatlist;