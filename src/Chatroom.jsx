import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { UserContext } from './UserContext';
import './Chatroom.scss';

function Chatroom() {
  const [messages, setMessages] = useState([]); // メッセージのステート
  const [input, setInput] = useState(''); // 入力フィールドの状態
  const chatWindowRef = useRef(null); // chatWindowの参照
  const websocketRef = useRef(null); // WebSocketの参照
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const room = location.state?.room;
  const roomId = room?.id;
  const roomName = room?.name; // 表示用のルーム名

  const user_id = localStorage.getItem('user_id');

  // チャット相手の username を取得
  const otherUser = room?.users.find((u) => u.user_id !== user_id); // 自分以外のユーザーを特定
  const roomTitle = otherUser?.username || 'チャットルーム';

  // チャット履歴を取得する関数
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://aichihack-back-153bffff1dd9.herokuapp.com/app/chat-history/${roomId}/`,
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        const chatHistory = response.data.messages.map((message) => ({
          id: message.id,
          sender_id: message.sender.id,
          sender_name: message.sender.username || 'Unknown',
          message: message.message || '',
          timestamp: new Date(message.timestamp),
        }));

        setMessages(chatHistory.reverse()); // 最新のメッセージを一番下に表示
      } catch (error) {
        console.error('チャット履歴の取得に失敗しました:', error);
      }
    };

    fetchChatHistory(); // チャット履歴を取得
  }, [roomId]);

  // WebSocketの初期化
  useEffect(() => {
    const websocket = new WebSocket(`wss://aichihack-back-153bffff1dd9.herokuapp.com/ws/chat/${roomName}/`);
    websocketRef.current = websocket;

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('data_websocket: ', data)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: data.id,
          sender_id: data.sender_id,
          sender_name: data.sender_name || 'Unknown',
          message: data.message,
          timestamp: new Date(data.timestamp),
        },
      ]);
    };

    websocket.onclose = () => {
      console.error('WebSocketが閉じられました');
    };

    return () => {
      websocket.close();
    };
  }, [roomName]);

  // メッセージ送信
  const handleSend = () => {
    if (!input.trim()) return;

    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(
        JSON.stringify({
          message: input,
          sender_id: user.id,
        })
      );
      setInput('');
    } else {
      console.error('WebSocketが未接続です。');
    }
  };

  const handleBack = () => {
    navigate('/chatlist');
  };

  console.log(messages)

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <FontAwesomeIcon icon={faArrowLeft} onClick={handleBack} className="back-icon" />
        <p className="chatroom-title">{roomTitle}</p>
      </div>
      <div className="chatroom-window" ref={chatWindowRef}>
        {messages.map((msg) => (
          <div key={msg.id} className="chat-message-container">
            {msg.sender_id !== user_id && (
              <span className="chat-sender-name">{msg.sender_name}</span>
            )}
            <div
              className={`chat-message ${
                msg.sender_id === user_id ? 'chat-message-sent' : 'chat-message-received'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="chatroom-input-container">
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button className="send-button" onClick={handleSend}>
          送信
        </button>
      </div>
    </div>
  );
}

export default Chatroom;
