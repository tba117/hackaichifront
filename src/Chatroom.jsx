import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { UserContext } from './UserContext';

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

  // チャット相手の username を取得
  const otherUser = room?.users.find((u) => u.id !== user.id); // 自分以外のユーザーを特定
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
    const websocket = new WebSocket(`ws://aichihack-back-153bffff1dd9.herokuapp.com/ws/chat/${roomName}/`);
    websocketRef.current = websocket;

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
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


  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <FontAwesomeIcon icon={faArrowLeft} onClick={handleBack} />
        <p style={styles.chattitle}>{roomTitle}</p>
      </div>
      <div style={styles.chatWindow} ref={chatWindowRef}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 名前をメッセージの上に表示 */}
            {msg.sender_id !== user.id && (
              <span style={styles.senderName}>{msg.sender_name}</span>
            )}
            <div
              style={{
                ...styles.message,
                alignSelf: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender_id === user.id ? '#00aced' : '#fff',
                color: msg.sender_id === user.id ? '#fff' : '#000',
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力"
        />
        <button style={styles.sendButton} onClick={handleSend}>
          送信
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: '92.5vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#00aced',
    color: 'white',
    padding: '15px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  chattitle: {
    margin: 0,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  chatWindow: {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    overflowY: 'scroll',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  senderName: {
    fontSize: '12px',
    color: '#555',
    marginBottom: '5px',
    alignSelf: 'flex-start',
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '70%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  inputContainer: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px',
    backgroundColor: '#00aced',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Chatroom;
